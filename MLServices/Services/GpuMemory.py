from threading import Lock
from docker.models.containers import Container
import pynvml
import config

class GpuMemoryMeta(type):
    """ Clas for controlling gpu memory """
    _instances = {}
    _lock: Lock = Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
        return cls._instances[cls]


class GpuMemory(metaclass=GpuMemoryMeta):
    def __init__(self) -> None:
        self.nvmlInited = False
        try:
            pynvml.nvmlInit()
            self.nvmlInited = True
        except:
            pass
        
        self.device_train_map: dict[str, str] = {}
        self.device_inference_map: dict[str, int] = {
            "gpu": 0,
            "kserve": 0
        }
        
        self.train_container_limit = self.get_total_video_memory() - config.MEMORY_SAFE_RESERVE
        self.inference_limit = self.get_total_video_memory() - config.MEMORY_SAFE_RESERVE
        
    def set_train_container_limit(self, limit):
        self.train_container_limit = limit + config.MEMORY_SAFE_RESERVE
        
    def set_inference_limit(self, limit):
        self.inference_limit = limit + config.MEMORY_SAFE_RESERVE
        
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
        
    def theretical_train_free_memory(self):
        total_used_memory = 0
        for _, device in self.device_train_map.items():
            if(device == "gpu"):
                total_used_memory += self.train_container_limit
        return self.get_total_video_memory() - self.inference_limit - total_used_memory
    
    def update_train_devices(self, containers_list: list[Container]):
        new_map = {}
        for container in containers_list:
            if(container.id in self.device_train_map):
                new_map[container.id] = self.device_train_map[container.id]
        self.device_train_map = new_map
        
    def add_new_train_request(self, container_id, device):
        self.device_train_map[container_id] = device
    
    def new_inference_request(self, device):
        self.device_inference_map[device] += 1
        
    def inference_request_end(self, device):
        self.device_inference_map[device] -= 1
        
    def enough_kserve_memory(self):
        kserve_training = 0
        for _, device in self.device_train_map.items():
            if(device == "kserve"):
                kserve_training += 1
        for _, device in self.device_inference_map.items():
            if(device == "kserve"):
                kserve_training += 1
        return kserve_training * config.KSERVE_BATCH_SIZE < config.KSERVE_LIMIT
    
    def enough_gpu_inference_memory(self):
        return self.device_inference_map["gpu"] * config.LOCAL_BATCH_SIZE < config.LOCAL_LIMIT