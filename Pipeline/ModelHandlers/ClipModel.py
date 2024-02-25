import numpy as np
import tensorflow as tf
from PreTrainedModel import PreTrainedModel
from ModelLoader import Models
from transformers import TFCLIPModel, AutoProcessor
import json

class ClipModel(PreTrainedModel):
    """ Class for pretrained keras models """
    
    def __init__(self) -> None:
        super().__init__()
        self.model: TFCLIPModel = None
        self.processor: AutoProcessor = None
    
    def preprocess(self, batch: np.ndarray) -> np.ndarray:
        return self.processor(images=batch, return_tensors="tf")
    
    def extract_features(self, batch: np.ndarray) -> np.ndarray:
        return self.model.get_image_features(**batch)
    
    def save(self, save_path: str) -> None:
        object_info = {
            "class": Models.Clip.value,
        }
        
        json_object = json.dumps(object_info, indent=4)
        
        with open(save_path, "w") as f:
            f.write(json_object)
    
    def load(self, load_path: str = None) -> None:
        self.model = TFCLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")
        