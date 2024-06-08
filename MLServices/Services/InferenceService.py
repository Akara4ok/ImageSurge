import hashlib
import requests
import sys
import random
import os
sys.path.append("OneClassML")
from utils.non_tf_functions import get_access_token
from GpuMemory import GpuMemory
from multiprocessing.pool import ThreadPool
from threading import Lock
from Dataloader.DataloaderImpl.InferenceDataloader import InferenceDataloader

class InferenceService:
    """ Class for sending request to inference microservice """
    def __init__(self, host: str, cpu_port: int, gpu_port: int) -> None:
        self.cpu_url = host + ":" + str(cpu_port)
        self.gpu_url = host + ":" + str(gpu_port)
        self.pool = ThreadPool(processes=8)
        self.device_map = {}
        self.lock = Lock()
    
    def getKey(self, user: str, project: str, experiment_str: str, device: str):
        return hashlib.sha256((user + project + experiment_str + device).encode('utf-8')).hexdigest()
    
    def load_task(self, url: str, data: dict):
        response = requests.post(url + "/load", json=data)
        return response
    
    def stop_task(self, url: str, data: dict):
        response = requests.post(url + "/stop", json=data)
        return response
            
    def load(self, user: str, project: str, experiment_str: str, cropping: bool, 
             kserve_classification_path: str = None, kserve_crop_path: str = None, 
             local_kserve: bool = True):
        
        data = {
            "user": user,
            "project": project,
            "experiment": experiment_str,
            "cropping": cropping
        }
        
        token = None
        if(kserve_classification_path is not None and not local_kserve):
            token = get_access_token()
            
        
        if(kserve_classification_path):
            data["kserve-path-classification"] = kserve_classification_path
            if(not local_kserve):
                data["token"] = token
            
        if(kserve_crop_path):
            data["kserve-path-crop"] = kserve_crop_path
            if(kserve_classification_path is None and not local_kserve):
                data["token"] = token
            
        use_kserve = kserve_classification_path is not None or kserve_crop_path is not None
        
        cpu_req = self.pool.apply_async(self.load_task, (self.cpu_url, data))
        gpu_req = self.pool.apply_async(self.load_task, (self.gpu_url, data))
        
        cpu_req = cpu_req.get()
        gpu_req = gpu_req.get()
        
        if(gpu_req.status_code == 200):
            self.device_map[self.getKey(user, project, experiment_str, "gpu")] = use_kserve
            
        if(cpu_req.status_code == 200):
            self.device_map[self.getKey(user, project, experiment_str, "cpu")] = use_kserve
            return cpu_req.json(), gpu_req.status_code
        
        
        return cpu_req.json(), cpu_req.status_code
        
    
    def stop(self, user: str, project: str, experiment_str: str, cropping: bool):
        data = {
            "user": user,
            "project": project,
            "experiment": experiment_str,
            "cropping": cropping
        }
        
        cpu_key = self.getKey(user, project, experiment_str, "cpu")
        gpu_key = self.getKey(user, project, experiment_str, "gpu")
        
        if(cpu_key in self.device_map.keys() and gpu_key in self.device_map.keys()):
            cpu_req = self.pool.apply_async(self.stop_task, (self.cpu_url, data))
            gpu_req = self.pool.apply_async(self.stop_task, (self.gpu_url, data))
            
            cpu_req = cpu_req.get()
            gpu_req = gpu_req.get()
            if(cpu_req.status_code == 200):
                self.device_map.pop(cpu_key)  
            else:
                return cpu_req.json(), cpu_req.status_code

            if(gpu_req.status_code == 200):
                self.device_map.pop(gpu_key)
            
            return gpu_req.json(), gpu_req.status_code
        
        if(cpu_key in self.device_map.keys()):
            response = requests.post(self.cpu_url + "/stop", json=data)
            if(response.status_code == 200):
                self.device_map.pop(cpu_key)  
            return response.json(), response.status_code
        
        if(gpu_key in self.device_map.keys()):
            response = requests.post(self.gpu_url + "/stop", json=data)
            if(response.status_code == 200):
                self.device_map.pop(gpu_key)  
            return response.json(), response.status_code
        
        return {
            "message": "inferences not loaded"
            }, 500


    def process(self, images: list, user: str, project: str, experiment_str: str, cropping: str,
                level: str, similarity: str = None, postprocessing: str = None): 
        multipart_form_data = [
            ('user', (None, user)),
            ('project', (None, project)),
            ('experiment', (None, experiment_str)),
            ('cropping', (None, cropping)),
            ('level', (None, level)),
            ('postprocessing', (None, postprocessing)),
        ]
        
        if(similarity is not None):
            multipart_form_data.append(('similarity', (None, similarity)))
            
        for image in images:
            multipart_form_data.append(('file', (image.filename, image.stream, image.mimetype)))
        
        cpu_key = self.getKey(user, project, experiment_str, "cpu")
        gpu_key = self.getKey(user, project, experiment_str, "gpu")
        
        self.lock.acquire(True)
        if(cpu_key in self.device_map.keys() and GpuMemory().enough_kserve_memory() and self.device_map[cpu_key] == True):
            GpuMemory().new_inference_request("kserve")
            self.lock.release()
            response = requests.post(self.cpu_url + "/process", files=multipart_form_data)
            GpuMemory().inference_request_end("kserve")
            return response
        
        if(not self.lock.locked()):
            self.lock.acquire(True)
        
        if(gpu_key in self.device_map.keys() and GpuMemory().enough_gpu_inference_memory()):
            GpuMemory().new_inference_request("gpu")
            self.lock.release()
            response = requests.post(self.gpu_url + "/process", files=multipart_form_data)
            GpuMemory().inference_request_end("gpu")
            return response
        
        if(self.lock.locked()):
            self.lock.release()
        
        response = requests.post(self.cpu_url + "/process", files=multipart_form_data)
        return response
    
    def croptune_start(self, user: str, project: str, experiment_str: str, count: int, dataset_paths: str, seed: int): 
        multipart_form_data = [
            ('user', (None, user)),
            ('project', (None, project)),
            ('experiment', (None, experiment_str)),
        ]
        
        dataloader = InferenceDataloader.create_from_multiple_paths(dataset_paths)
        paths = dataloader.get_images_paths()
        if(seed is None):
            random.shuffle(paths)
        else:
            random.Random(seed).shuffle(paths)
        paths = paths[:count]
        
        for image in paths:
            multipart_form_data.append(('file', (os.path.basename(image), open(image, 'rb'), 'image/jpeg')))
        
        cpu_key = self.getKey(user, project, experiment_str, "cpu")
        gpu_key = self.getKey(user, project, experiment_str, "gpu")
        
        self.lock.acquire(True)
        if(cpu_key in self.device_map.keys() and GpuMemory().enough_kserve_memory() and self.device_map[cpu_key] == True):
            GpuMemory().new_inference_request("kserve")
            self.lock.release()
            response = requests.post(self.cpu_url + "/croptunestart", files=multipart_form_data)
            GpuMemory().inference_request_end("kserve")
            return response
        
        if(not self.lock.locked()):
            self.lock.acquire(True)
        
        if(gpu_key in self.device_map.keys() and GpuMemory().enough_gpu_inference_memory()):
            GpuMemory().new_inference_request("gpu")
            self.lock.release()
            response = requests.post(self.gpu_url + "/croptunestart", files=multipart_form_data)
            GpuMemory().inference_request_end("gpu")
            return response
        
        if(self.lock.locked()):
            self.lock.release()
        
        response = requests.post(self.cpu_url + "/croptunestart", files=multipart_form_data)
        return response
    
    def croptune_test(self, user: str, project: str, experiment_str: str, level: int, similarity: int): 
        cpu_key = self.getKey(user, project, experiment_str, "cpu")
        gpu_key = self.getKey(user, project, experiment_str, "gpu")
        
        data = {
            "user": user,
            "project": project,
            "experiment": experiment_str,
        }
        
        if(level is not None):
            data["level"] = level
            
        if(similarity is not None):
            data["similarity"] = similarity
        
        self.lock.acquire(True)
        if(cpu_key in self.device_map.keys() and GpuMemory().enough_kserve_memory() and self.device_map[cpu_key] == True):
            GpuMemory().new_inference_request("kserve")
            self.lock.release()
            response = requests.post(self.cpu_url + "/croptunetest", data=data)
            GpuMemory().inference_request_end("kserve")
            return response
        
        if(not self.lock.locked()):
            self.lock.acquire(True)
        
        if(gpu_key in self.device_map.keys() and GpuMemory().enough_gpu_inference_memory()):
            GpuMemory().new_inference_request("gpu")
            self.lock.release()
            response = requests.post(self.gpu_url + "/croptunetest", data=data)
            GpuMemory().inference_request_end("gpu")
            return response
        
        if(self.lock.locked()):
            self.lock.release()
        
        response = requests.post(self.cpu_url + "/croptunetest", data=data)
        return response
    
    def croptune_stop(self, user: str, project: str, experiment_str: str): 
        cpu_key = self.getKey(user, project, experiment_str, "cpu")
        gpu_key = self.getKey(user, project, experiment_str, "gpu")
        
        data = {
            "user": user,
            "project": project,
            "experiment": experiment_str,
        }
        
        self.lock.acquire(True)
        if(cpu_key in self.device_map.keys() and GpuMemory().enough_kserve_memory() and self.device_map[cpu_key] == True):
            GpuMemory().new_inference_request("kserve")
            self.lock.release()
            response = requests.post(self.cpu_url + "/croptunestop", data=data)
            GpuMemory().inference_request_end("kserve")
            return response
        
        if(not self.lock.locked()):
            self.lock.acquire(True)
        
        if(gpu_key in self.device_map.keys() and GpuMemory().enough_gpu_inference_memory()):
            GpuMemory().new_inference_request("gpu")
            self.lock.release()
            response = requests.post(self.gpu_url + "/croptunestop", data=data)
            GpuMemory().inference_request_end("gpu")
            return response
        
        if(self.lock.locked()):
            self.lock.release()
        
        response = requests.post(self.cpu_url + "/croptunestop", data=data)
        return response