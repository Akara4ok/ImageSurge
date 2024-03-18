import json
import keras
import numpy as np
import tensorflow as tf
from keras.applications.resnet import preprocess_input
from keras.applications import ResNet50
from .ModelHandler import ModelHandler, Models
from .losses.ReferenceTrainingLosses import OneClassLoss
from .models.ResnetTrainingModel import ResnetTrainingModel
from Dataset.TrainModelDataset import TrainModelDataset
from Dataset.TrainRefDataset import TrainRefDataset
from utils.functions import to_numpy_image, to_numpy_image_label

class ImprovedResnet(ModelHandler):
    """ Class for training resnet with reference dataset """
    
    def __init__(self, image_width: int, image_height: int, learning_rate: float = 0.001, alpha: float = 0.1) -> None:
        super().__init__()
        self.image_width = image_width
        self.image_height = image_height
        self.learning_rate = learning_rate
        self.alpha = alpha
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
            'one_class': OneClassLoss(self.alpha),
            'resnet_ref_dense': tf.keras.losses.SparseCategoricalCrossentropy()
        }
        
        self.model.compile(loss=losses, optimizer=tf.keras.optimizers.SGD(learning_rate=self.learning_rate))
        preproc_dataset = dataset.get_train_model_data()
        self.model.fit(preproc_dataset, epochs = epochs)
        
        inference_model = ResNet50(input_shape=(224, 224, 3), weights=None, include_top=False, pooling='avg')
        inference_model.set_weights(self.model.get_layer('resnet50').get_weights())
        self.model = inference_model
    
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
        return (to_numpy_image(feature_ds), None)
    
    def save(self, save_path: str) -> None:
        model_path = save_path + "_model.keras"
        self.model.save(model_path)
        
        object_info = {
            "class": Models.ImprovedResnet.value,
            "image_width": self.image_width,
            "image_height": self.image_height,
            "model_path": model_path
        }
        
        json_object = json.dumps(object_info, indent=4)
        
        save_path += "_metainfo.json"
        with open(save_path, "w") as f:
            f.write(json_object)
    
    def load(self, load_path: str) -> None:
        self.model = keras.models.load_model(load_path)        