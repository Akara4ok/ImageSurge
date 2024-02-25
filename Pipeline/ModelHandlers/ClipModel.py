import numpy as np
import tensorflow as tf
from PreTrainedModel import PreTrainedModel
from transformers import TFCLIPModel, AutoProcessor

class SimpleKerasModel(PreTrainedModel):
    """ Class for pretrained keras models """
    
    def __init__(self) -> None:
        super().__init__()
        self.model: TFCLIPModel = None
        self.processor: AutoProcessor = None
    
    def preprocess(self, batch: np.ndarray) -> np.ndarray:
        return self.processor(images=batch, return_tensors="tf")
    
    def extract_features(self, batch: np.ndarray) -> np.ndarray:
        return self.model.get_image_features(**batch)
    
    def load(self, load_path: str) -> None:
        self.model = TFCLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")
        