from abc import ABC, abstractmethod
import numpy as np
import tensorflow as tf
import sys
import enum
sys.path.append("Dataset")
from TrainModelDataset import TrainModelDataset

class Models(enum.Enum):
    SimpleKeras = 1
    Clip = 2
    ImprovedResnet = 3

class ModelHandler(ABC):
    """ Abstract class for model handler """
    
    @abstractmethod
    def preprocess(self, batch: tf.Tensor) -> np.ndarray:
        """ process image or batch for model """
        pass
    
    @abstractmethod
    def train(self, dataset: TrainModelDataset, epochs: int) -> None:
        """ train model """
        pass
    
    @abstractmethod
    def extract_features(self, batch: tf.Tensor) -> np.ndarray:
        """ extract features from image or batch """
        pass
    
    @abstractmethod
    def extract_features_in_dataset(self, dataset: tf.data.Dataset) -> tuple[np.ndarray, np.ndarray]:
        """ extract features from dataset """
        pass
    
    @abstractmethod
    def save(self, save_path: str) -> None:
        """ save model """
        pass
    
    @abstractmethod
    def load(self, load_path: str) -> None:
        """ load model """
        pass