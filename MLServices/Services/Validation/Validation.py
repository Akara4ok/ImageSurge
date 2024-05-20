import cv2
from abc import ABC, abstractmethod
import os
import sys
sys.path.append("OneClassML")
sys.path.append("Services")
from Dataloader.DataloaderImpl.InferenceDataloader import InferenceDataloader
from data_utils import download, unzip
import config

IMAGE_HEIGHT = 224
IMAGE_WIDTH = 224

class Validator(ABC):
    @abstractmethod
    def validate(self, data_path, name, source: int) -> list[str]:
        pass


class BrisqueValidator(Validator):
    def __init__(self, default_folder = config.DATA_DIR, threshold: float = 40.0, model_path: str = "Services/Validation") -> None:
        self.threshold = threshold
        self.model_path = model_path
        self.default_folder = default_folder
        
    def validate(self, data_path, name, source: int) -> list[str]:
        downloaded = download(data_path, self.default_folder, name, source)
        unzip(downloaded, self.default_folder, name)
        downloaded = downloaded.replace(".zip", "")
        
        dataloader = InferenceDataloader(downloaded)
        images_path = dataloader.get_images_paths()
        
        result = []
        quality = 0
        
        for path in images_path:
            img = cv2.imread(path)
            img = cv2.resize(img, (IMAGE_HEIGHT, IMAGE_WIDTH))
            score = cv2.quality.QualityBRISQUE_compute(img, self.model_path + "/brisque_model_live.yml", 
                                                       self.model_path + "/brisque_range_live.yml")
            
            if(score[0] <= self.threshold):
                result.append(os.path.relpath(path, start=downloaded))
                quality += score[0]
        
        return result, quality / (len(result) if len(result) > 0 else 1)