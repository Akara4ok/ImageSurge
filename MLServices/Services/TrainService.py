import enum
import shutil
import os
import sys
import gdown
import subprocess
import zipfile
sys.path.append("OneClassML")
from utils.non_tf_functions import get_access_token
import docker
import config
from multiprocessing.pool import ThreadPool
from threading import Lock
from GpuMemory import GpuMemory
from data_utils import download, unzip

class TrainService:
    """ Service for creating training pipelines """
    def __init__(self, default_folder: str, abs_path: str, image_name: str, time_limit: int = 3600) -> None:
        self.default_folder = default_folder
        self.abs_path = abs_path
        self.client = docker.from_env()
        self.image_name = image_name
        self.time_limit = time_limit
        self.working_dir = config.WORKDIR
        self.device_map: dict[str, str] = {}
        self.pool = ThreadPool(processes=8)
        self.subscriptions: dict = {}
        self.connections: list = []
        self.lock = Lock()
        
    def add_socket(self, ws):
        self.connections.append(ws)
                
    def get_ref_path(self, category: str) -> str:
        match category:
            case "Animals":
                return self.default_folder + "animals_multiclass"
            case "Faces":
                return self.default_folder + "multiclass_faces"
            case _:
                return self.default_folder + "natural_images"
        
    def wait_task(self, container):
        try:
            return container.wait(timeout=self.time_limit)
        except:
            container.kill()
            return {"Status code": 139}
        
    def send_result_ws(self, container):
        result = self.wait_task(container)
        for conn in self.connections:
            conn.send(result)
            
    def train(self, user: str, project: str, experiment_str: str, model_name: str, 
              cropping: bool, data_path: list[str], dataset_names: list[str],
              sources: list[str], category: str = None, kserve_path_classification: str = None, 
              kserve_path_crop: str = None, local_kserve: bool = True, 
              save_path: str = "Artifacts/") -> None:
        downloaded_paths: list[str] = []
        for i, path in enumerate(data_path):
            downloaded = download(path, self.default_folder, dataset_names[i], sources[i])
            downloaded_paths.append(downloaded)
            unzip(downloaded, self.default_folder, dataset_names[i])
        
        command_args = ["python3", "Services/train.py", "--user", user, "--project", project, "--experiment", experiment_str, 
                        "--model-name", model_name, "--cropping", str(cropping), "--data-path", ",".join(downloaded_paths)]
        
        if(category is not None):
            command_args +=  ["--ref-data-path", self.get_ref_path(category)]        
        
        command_args += ["--save-folder", save_path]

        volumes = []
        for path in downloaded_paths:
            volumes.append(f"{self.abs_path + '/' +path}:{self.working_dir + path}")
        volumes.append(f"{self.abs_path + '/' + save_path}:{self.working_dir + save_path}")
        
        with self.lock:
            free_memory = GpuMemory().get_free_video_memory()
                    
            GpuMemory().update_train_devices(self.client.containers.list())
            theoretical_free_memory = GpuMemory().theretical_train_free_memory()
            
            token = None
            if(not local_kserve):
                token = get_access_token()
                
            kserve_but_not_enough = (kserve_path_classification is not None or kserve_path_crop is not None) and GpuMemory().enough_kserve_memory()
                
            if(kserve_path_classification and GpuMemory().enough_kserve_memory()):
                command_args +=  ["--kserve-path-classification", kserve_path_classification]
                if(not local_kserve):
                    command_args += ["--token", token]
                
            if(kserve_path_crop and GpuMemory().enough_kserve_memory()):
                command_args +=  ["--kserve-path-crop", kserve_path_crop]
                if(kserve_path_classification is None and not local_kserve):
                    command_args += ["--token", token]
                
            command_args = " ".join(command_args)
            
            if(free_memory > GpuMemory().train_container_limit and theoretical_free_memory > GpuMemory().train_container_limit 
               and not kserve_but_not_enough):
                command_args += f" --memory-limit {GpuMemory().train_container_limit - config.MEMORY_SAFE_RESERVE}"
                container = self.client.containers.run(self.image_name, command_args, runtime="nvidia",
                                                device_requests=[docker.types.DeviceRequest(count=-1, capabilities=[['gpu']])], 
                                                volumes=volumes, working_dir = self.working_dir, detach = True, auto_remove = True)
                GpuMemory().add_new_train_request(container.id, "gpu")
            else:
                container = self.client.containers.run(self.image_name, command_args, volumes=volumes, 
                                                    working_dir = self.working_dir, detach = True,  auto_remove = True)
                
                if(kserve_but_not_enough):
                    GpuMemory().add_new_train_request(container.id, "kserve")
                else:
                    GpuMemory().add_new_train_request(container.id, "cpu")
                    
        self.pool.apply_async(self.send_result_ws, (container,))
        return 0