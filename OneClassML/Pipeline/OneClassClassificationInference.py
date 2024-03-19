import tensorflow as tf
import numpy as np
import logging
from .Inference import Inference
from .utils.FileHandler import FileHandler
from .ModelHandlers.KServeModel import KServeModel

class OneClassClassificationInference(Inference):
    """ Class for infernce one class classification """
    
    def __init__(self, file_handler: FileHandler, kserve_model: KServeModel = None) -> None:
        super().__init__(file_handler, kserve_model)
        self.cluster_center: np.ndarray = None
        
    @Inference.need_load
    def process(self, dataset: tf.data.Dataset, use_cache: bool = False,
                save_cache: bool = False, is_test: bool = False) -> np.ndarray:
        
        if(self.feature_extractor is None or self.one_class is None):
            raise Exception("Inference not loaded models")
        
        if(not use_cache or self.cached_feauteres is None):
            x, self.cached_labels = self.feature_extractor.extract_features_in_dataset(dataset, is_test)
        else:
            x = self.cached_feauteres
        
        if(save_cache):
            self.cache_features(x, self.cached_labels)
            
        logging.info("Feature extractor has been trained")
        
        # scale features
        if(self.scaler):
            x = self.scaler.transform(x)
            logging.info("Features scaled")
        
        #dimension reduction
        if(self.feature_reduction):
            x = self.feature_reduction.transform(x)
            logging.info("Dimensions reduced")
        
        #train one class classification
        y_predicted = self.one_class.predict(x)
        y_predicted[y_predicted == -1] = 0
        return y_predicted