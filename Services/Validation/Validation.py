import cv2
from abc import ABC, abstractmethod
import sys
sys.path.append("OneClassML")
from Dataloader.DataloaderImpl.InferenceDataloader import InferenceDataloader

IMAGE_HEIGHT = 224
IMAGE_WIDTH = 224

class Validator(ABC):
    @abstractmethod
    def validate(self, data_path: int) -> list[str]:
        pass


class BrisqueValidator(Validator):
    def __init__(self, threshold: float = 40.0, model_path: str = "Services/Validation") -> None:
        self.threshold = threshold
        self.model_path = model_path
        
    def validate(self, data_path: int) -> list[str]:
        dataloader = InferenceDataloader(data_path)
        images_path = dataloader.get_images_paths()
        
        result = []
        
        for path in images_path:
            img = cv2.imread(path)
            img = cv2.resize(img, (IMAGE_HEIGHT, IMAGE_WIDTH))
            score = cv2.quality.QualityBRISQUE_compute(img, self.model_path + "/brisque_model_live.yml", 
                                                       self.model_path + "/brisque_range_live.yml")
            
            if(score[0] <= self.threshold):
                result.append(path)
        
        return result