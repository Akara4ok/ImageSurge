import tensorflow as tf
import numpy as np
import keras
from keras.applications.resnet import preprocess_input
from keras.applications import ResNet50
import sys
import json
from ModelHandler import ModelHandler, Models
from losses.ReferenceTrainingLosses import one_class_loss, multi_class_loss
from models.ResnetTrainingModel import ResnetTrainingModel
sys.path.append("Dataset")
from TrainModelDataset import TrainModelDataset
from TrainRefDataset import TrainRefDataset
sys.path.append("Pipeline")
from utils.FileHandler import model_path_suffix
sys.path.append("utils")
from functions import to_numpy_image_label

class ImprovedResnet(ModelHandler):
    """ Class for training resnet with reference dataset """
    
    def __init__(self, image_width: int, image_height: int) -> None:
        super().__init__()
        self.image_width = image_width
        self.image_height = image_height
        self.model: keras.Model = None
    
    def preprocess(self, batch: tf.Tensor) -> tf.Tensor:
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
    
    def extract_features(self, batch: tf.Tensor) -> tf.Tensor:
        return self.model(batch)

    def extract_features_in_dataset(self, dataset: tf.data.Dataset) -> tuple[np.ndarray, np.ndarray]:
        def full_process(x: tf.Tensor, y: tf.Tensor) -> tf.Tensor:
            processed_x = self.preprocess(x)
            features = self.extract_features(processed_x)
            return features, y
        
        feature_ds = dataset.map(lambda x, y: tf.py_function(full_process, [x, y], [tf.float32, tf.float32]))
        
        return to_numpy_image_label(feature_ds)
    
    def save(self, save_path: str) -> None:
        inference_model = ResNet50(input_shape=(224, 224, 3), weights=None, include_top=False, pooling='avg')
        inference_model.set_weights(self.model.get_layer('resnet50').get_weights())
        inference_model.save(save_path)
        
        model_path = "".join(save_path.split[:-1])
        model_path = model_path.replace(model_path_suffix, "_model")
        object_info = {
            "class": Models.ImprovedResnet.value,
            "image_width": self.image_width,
            "image_height": self.image_height,
            "model_path": model_path
        }
        
        json_object = json.dumps(object_info, indent=4)
        
        with open(save_path, "w") as f:
            f.write(json_object)
    
    def load(self, load_path: str) -> None:
        self.model = keras.models.load_model(load_path)        