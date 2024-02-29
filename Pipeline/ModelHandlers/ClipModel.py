import tensorflow as tf
from ModelHandler import Models
from PreTrainedModel import PreTrainedModel
from transformers import TFCLIPModel, AutoProcessor
import json
import sys
import numpy as np
sys.path.append("utils")
from functions import to_numpy_image, to_numpy_image_label

class ClipModel(PreTrainedModel):
    """ Class for pretrained keras models """
    
    def __init__(self) -> None:
        super().__init__()
        self.model: TFCLIPModel = None
        self.processor: AutoProcessor = None
    
    def preprocess(self, batch: tf.Tensor) -> tf.Tensor:
        return self.processor(images=batch, return_tensors="tf")
    
    def extract_features(self, batch: tf.Tensor) -> tf.Tensor:
        return self.model.get_image_features(**batch)
    
    def extract_features_in_dataset(self, dataset: tf.data.Dataset, is_train_ds: bool = True) -> tuple[np.ndarray, np.ndarray]:
        def full_process_x(x: tf.Tensor) -> tf.Tensor:
            processed_x = self.preprocess(x.numpy())
            features = self.extract_features(processed_x)
            return features
        
        def full_process(x: tf.Tensor, y: tf.Tensor) -> tf.Tensor:
            return full_process_x(x), tf.cast(y, tf.float32)
        
        if(is_train_ds):
            feature_ds = dataset.map(lambda x, y: tf.py_function(full_process, [x, y], [tf.float32, tf.float32]))
            return to_numpy_image_label(feature_ds)
        
        feature_ds = dataset.map(lambda x: tf.py_function(full_process_x, [x], tf.float32))
        return (to_numpy_image(feature_ds), None)
    
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
        