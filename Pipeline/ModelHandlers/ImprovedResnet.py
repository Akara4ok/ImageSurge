import numpy as np
import tensorflow as tf
import keras
from keras.applications.resnet import preprocess_input
from keras.applications import ResNet50
import sys
from ModelHandler import ModelHandler
from losses.ReferenceTrainingLosses import one_class_loss, multi_class_loss
from models.ResnetTrainingModel import ResnetTrainingModel
sys.path.append("Dataset")
from TrainModelDataset import TrainModelDataset
from TrainRefDataset import TrainRefDataset

class ImprovedResnet(ModelHandler):
    """ Class for training resnet with reference dataset """
    
    def __init__(self, image_width: int, image_height: int) -> None:
        super().__init__()
        self.image_width = image_width
        self.image_height = image_height
        self.model: keras.Model = None
    
    def preprocess(self, batch: np.ndarray) -> np.ndarray:
        if(len(batch.shape) == 3):
            batch = tf.expand_dims(batch, axis=0)
        batch = preprocess_input(batch)
        return batch
    
    def train(self, dataset: TrainModelDataset, epochs: int) -> None:
        if(not isinstance(dataset, TrainRefDataset)):
            raise Exception("This dataset is not suitable for training this model")
        
        self.model = ResnetTrainingModel((self.image_width, self.image_height, 3), dataset.get_labels_count())

        losses = {
            'resnet50': multi_class_loss,
            'resnet_ref_dense': one_class_loss
        }
        
        self.model.compile(loss=losses, optimizer=tf.keras.optimizers.SGD(learning_rate=0.0001))
        self.model.fit(dataset.get_train_model_data(), epochs = epochs)
    
    def extract_features(self, batch: np.ndarray) -> np.ndarray:
        return self.model(batch)
    
    def save(self, save_path: str) -> None:
        inference_model = ResNet50(input_shape=(224, 224, 3), weights=None, include_top=False, pooling='avg')
        inference_model.set_weights(self.model.get_layer('resnet50').get_weights())
        inference_model.save(save_path)
    
    def load(self, load_path: str) -> None:
        self.model = keras.models.load_model(load_path  )
        