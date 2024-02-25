import numpy as np
import tensorflow as tf
import enum
import keras.applications.vgg16
import keras.applications.resnet
from keras.applications import ResNet50
from keras.applications import VGG16
from PreTrainedModel import PreTrainedModel

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
    
    def preprocess(self, batch: np.ndarray) -> np.ndarray:
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
    
    def extract_features(self, batch: np.ndarray) -> np.ndarray:
        return self.model(batch)
    
    def load(self, load_path: str) -> None:
        match self.model_type:
            case KerasModels.VGG:
                self.model = VGG16(input_shape=(self.image_width, self.image_height, 3), weights='imagenet', include_top=False, pooling='avg')
            case KerasModels.Resnet:
                self.model = ResNet50(input_shape=(self.image_width, self.image_height, 3), weights='imagenet', include_top=False, pooling='avg')
            case _:
                raise Exception(f"Undefined model type {self.model_type.name}")
        