import enum
import shutil
import os
import sys
import gdown
import subprocess
import zipfile
sys.path.append("OneClassML")
from utils.functions import get_access_token
import docker
import pynvml
import config

class DatasetSource(enum.Enum):
    LocalZip = 1
    LocalFolder = 2
    Minio = 3
    GDrive = 4

class TrainService:
    """ Service for creating training pipelines """
    def __init__(self, default_folder: str, image_name: str, memory_limit: int, time_limit: int = 3600) -> None:
        self.default_folder = default_folder
        self.client = docker.from_env()
        self.image_name = image_name
        self.memory_limit = memory_limit + config.MEMORY_SAFE_RESERVE
        self.time_limit = time_limit
        self.nvmlInited = False
        self.working_dir = config.WORKDIR
        self.device_map: dict[str, str] = {}
        
        try:
            pynvml.nvmlInit()
            self.nvmlInited = True
        except:
            pass
    
    def get_free_video_memory(self):
        if(not self.nvmlInited):
            return 0
        
        try:
            device_count = pynvml.nvmlDeviceGetCount()
            free_memory = 0
            for i in range(device_count):
                handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
                free_memory += memory_info.free
            return free_memory / 1024 / 1024
        except pynvml.NVMLError as e:
            return 0
        
    def get_total_video_memory(self):
        if(not self.nvmlInited):
            return 0
        
        try:
            device_count = pynvml.nvmlDeviceGetCount()
            free_memory = 0
            for i in range(device_count):
                handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
                free_memory += memory_info.total
            return free_memory / 1024 / 1024
        except pynvml.NVMLError as e:
            return 0
    
    def download(self, path: str, dataset_name: str = "", source: int = 1) -> str:
        folder_res = self.default_folder + dataset_name
        if(os.path.exists(folder_res)):
            return folder_res
        if(os.path.exists(folder_res + ".zip")):
            return folder_res + ".zip"
        
        source = DatasetSource(source)
        
        match source:
            case DatasetSource.LocalZip:
                shutil.copytree(path, self.default_folder + dataset_name + ".zip")
                return folder_res
            case DatasetSource.LocalFolder:
                shutil.copytree(path, self.default_folder + dataset_name)
                return folder_res
            case DatasetSource.Minio:
                subprocess.call(["mc", "cp", "--recursive", path, self.default_folder])
            case DatasetSource.GDrive:
                gdown.download(path, self.default_folder + dataset_name + ".zip", fuzzy=True)
        return folder_res + ".zip"
                
    def unzip(self, path: str, dataset_name: str):
        if(os.path.isdir(path)):
            return
        
        save_path = self.default_folder + dataset_name
        if(os.path.isdir(save_path)):
            return
        if(not path.lower().endswith(('.zip'))):
            return
        
        
        with zipfile.ZipFile(path, 'r') as zip_ref:
            zip_ref.extractall(save_path)
            
            def get_single_subdirectory(path: str) -> str:
                subdirectories = [name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))]
                if len(subdirectories) == 1:
                    return path + "/" + subdirectories[0]
                else:
                    return None
            def move_files_and_delete_folder(src_folder: str, dest_folder: str) -> None:
                for file_name in os.listdir(src_folder):
                    src_file_path = os.path.join(src_folder, file_name)
                    dest_file_path = os.path.join(dest_folder, file_name)
                    shutil.move(src_file_path, dest_file_path)

                os.rmdir(src_folder)
                        
            subfolder = get_single_subdirectory(save_path)
            if(subfolder is not None):
                move_files_and_delete_folder(subfolder, save_path)
                
    def get_ref_path(self, category: str) -> str:
        match category:
            case "Animals":
                return self.default_folder + "animals_multiclass"
            case "Faces":
                return self.default_folder + "multiclass_faces"
            case _:
                return self.default_folder + "natural_images"

    def enough_kserve_memory(self):
        kserve_training = 0
        for _, device in self.device_map.items():
            if(device == "kserve"):
                kserve_training += 1
        return kserve_training <= config.KSERVE_LIMIT // config.KSERVE_BATCH_SIZE
    
    def theretical_free_memory(self):
        total_used_memory = 0
        for _, device in self.device_map.items():
            if(device == "gpu"):
                total_used_memory += self.memory_limit
        return self.get_total_video_memory() - total_used_memory
        
    def update_device_map(self):
        containers = self.client.containers.list()
        new_map = {}
        for container in containers:
            if(container.id in self.device_map):
                new_map[container.id] = self.device_map[container.id]
        self.device_map = new_map
            
    def train(self, user: str, project: str, experiment_str: str, model_name: str, 
              cropping: bool, data_path: list[str], dataset_names: list[str],
              sources: list[str], category: str = None, kserve_path_classification: str = None, 
              kserve_path_crop: str = None, local_kserve: bool = True, 
              save_path: str = "Artifacts/") -> None:
        
        downloaded_paths: list[str] = []
        for i, path in enumerate(data_path):
            downloaded = self.download(path, dataset_names[i], sources[i])
            downloaded_paths.append(downloaded)
            self.unzip(downloaded, dataset_names[i])
            
        command_args = ["python3", "Services/train.py", "--user", user, "--project", project, "--experiment", experiment_str, 
                        "--model-name", model_name, "--cropping", str(cropping), "--data-path", ",".join(downloaded_paths)]
        
        if(category is not None):
            command_args +=  ["--ref-data-path", self.get_ref_path(category)]        
        
        command_args += ["--save-folder", save_path]

        volumes = []
        for path in downloaded_paths:
            volumes.append(f"{os.path.abspath(path)}:{self.working_dir + path}")
        volumes.append(f"{os.path.abspath(save_path)}:{self.working_dir +save_path}")
        
        free_memory = self.get_free_video_memory()
                
        self.update_device_map()
        theoretical_free_memory = self.theretical_free_memory()
        
        token = None
        if(not local_kserve):
            token = get_access_token()
            
        kserve_but_not_enough = (kserve_path_classification is not None or kserve_path_crop is not None) and self.enough_kserve_memory()
            
        if(kserve_path_classification and self.enough_kserve_memory()):
            command_args +=  ["--kserve-path-classification", kserve_path_classification]
            if(not local_kserve):
                command_args += ["--token", token]
            
        if(kserve_path_crop and self.enough_kserve_memory()):
            command_args +=  ["--kserve-path-crop", kserve_path_classification]
            if(kserve_path_classification is None and not local_kserve):
                command_args += ["--token", token]
            
        command_args = " ".join(command_args)
        
        if(free_memory > self.memory_limit and theoretical_free_memory > self.memory_limit and not kserve_but_not_enough):
            command_args += f" --memory-limit {self.memory_limit - config.MEMORY_SAFE_RESERVE}"
            container = self.client.containers.run(self.image_name, command_args, 
                                              device_requests=[docker.types.DeviceRequest(count=-1, capabilities=[['gpu']])], 
                                              volumes=volumes, working_dir = self.working_dir, detach = True, auto_remove = True)
            self.device_map[container.id] = "gpu"
        else:
            container = self.client.containers.run(self.image_name, command_args, volumes=volumes, 
                                                   working_dir = self.working_dir, detach = True,  auto_remove = True)
            
            if(kserve_but_not_enough):
                self.device_map[container.id] = "kserve"
            else:
                self.device_map[container.id] = "cpu"
                
        try:
            return container.wait(timeout=self.time_limit)
        except:
            container.kill()
            return {"Status code": 139}