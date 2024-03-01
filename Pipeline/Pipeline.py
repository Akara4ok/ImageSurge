from utils.FileHandler import FileHandler
from utils.SklearnInterface import SklearnInterface
from ModelHandlers.ModelHandler import ModelHandler
import numpy as np
import tensorflow as tf

class Pipeline:
    """ Abstract class for training, testing and inference pipeline """
    def __init__(self, file_handler: FileHandler) -> None:
        self.file_handler = file_handler
        self.feature_extractor: ModelHandler = None
        self.scaler: SklearnInterface = None
        self.feature_reduction: SklearnInterface = None
        self.one_class: SklearnInterface = None
        
        self.cached_feauteres: np.ndarray = None
        self.cached_labels: np.ndarray = None
    
    def get_cache_data(self) -> tuple[np.ndarray, np.ndarray]:
        """ Get cache features and labels """
        return self.cached_feauteres, self.cached_labels
    
    def cache_features(self, x: np.ndarray, y: np.ndarray = None) -> None:
        """ Cache features for futher processing """
        self.cached_feauteres = x
        self.cached_labels = y
    
    def cache_features_with_process(self, dataset: tf.data.Dataset, is_testable_ds: bool = True) -> None:
        """ Cache features for futher processing """
        self.cached_feauteres, y = self.feature_extractor.extract_features_in_dataset(dataset, is_testable_ds)
        if(is_testable_ds):
            self.cached_labels = y