import enum
import json
import numpy as np
import tensorflow as tf
import keras.applications.vgg16
import keras.applications.resnet
from keras.applications import ResNet50
from keras.applications import VGG16
from .PreTrainedModel import PreTrainedModel
from .ModelHandler import Models
from utils.functions import to_numpy_image, to_numpy_image_label

class KerasModels(enum.Enum):
    VGG = 1
    Resnet = 2

class SimpleKerasModel(PreTrainedModel):
    """ Class for pretrained keras models """
    
    def __init__(self, image_width: int, image_height: int, model_type: KerasModels) -> None:
        super().__init__()
        self.image_width = image_width
        self.image_height = image_height
        self.model_type = model_type
        self.model: keras.Model = None
    
    def preprocess(self, batch: tf.Tensor) -> tf.Tensor:        
        if(len(batch.shape) == 3):
            batch = tf.expand_dims(batch, axis=0)
        match self.model_type:
            case KerasModels.VGG:
                batch = keras.applications.vgg16.preprocess_input(batch)
            case KerasModels.Resnet:
                batch = keras.applications.resnet.preprocess_input(batch)
            case _:
                raise Exception(f"Undefined model type {self.model_type.name}")
        
        return batch
    
    def extract_features(self, batch: tf.Tensor) -> tf.Tensor:
        return self.model(batch)
    
    def extract_features_in_dataset(self, dataset: tf.data.Dataset, is_train_ds: bool = True) -> tuple[np.ndarray, np.ndarray]:      
        def full_process_x(x: tf.Tensor) -> tf.Tensor:
            processed_x = self.preprocess(x)
            features = self.extract_features(processed_x)
            return features
        
        def full_process(x: tf.Tensor, y: tf.Tensor) -> tf.Tensor:
            return full_process_x(x), tf.cast(y, tf.float32)
        
        if(is_train_ds):
            feature_ds = dataset.map(lambda x, y: tf.py_function(full_process, [x, y], [tf.float32, tf.float32]))
            return to_numpy_image_label(feature_ds)
        
        feature_ds = dataset.map(lambda x: tf.py_function(full_process_x, [x], tf.float32))
        return to_numpy_image(feature_ds), None
    
    def save(self, save_path: str) -> None:
        save_path += "_metainfo.json"
        object_info = {
            "class": Models.SimpleKeras.value,
            "model_type": self.model_type.value,
            "image_width": self.image_width,
            "image_height": self.image_height
        }
        
        json_object = json.dumps(object_info, indent=4)
        
        with open(save_path, "w") as f:
            f.write(json_object)
    
    def load(self, load_path: str = None) -> None:
        match self.model_type:
            case KerasModels.VGG:
                self.model = VGG16(input_shape=(self.image_width, self.image_height, 3), weights='imagenet', include_top=False, pooling='avg')
            case KerasModels.Resnet:
                self.model = ResNet50(input_shape=(self.image_width, self.image_height, 3), weights='imagenet', include_top=False, pooling='avg')
            case _:
                raise Exception(f"Undefined model type {self.model_type.name}")