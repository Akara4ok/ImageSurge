import tensorflow as tf
import numpy as np
import logging
from .Inference import Inference
from .OneClassClassificationInference import OneClassClassificationInference
from .utils.FileHandler import FileHandler
from utils.functions import calculate_similarity, filter_similarity
from sklearn.metrics.pairwise import cosine_similarity

class OneClassClassificationSimilarity(OneClassClassificationInference):
    """ Class for infernce one class classification using similarity """
    
    def __init__(self, file_handler: FileHandler) -> None:
        super().__init__(file_handler)
    
    @Inference.need_load
    def process(self, dataset: tf.data.Dataset,
                use_cache: bool = False, is_test: bool = False, threshold: float = None) -> np.ndarray:
        """ Train all pipeline stages """
        
        if(not self.feature_extractor or not self.one_class):
            raise Exception("Inference not loaded models")
        
        if(not use_cache or self.cached_feauteres is None):
            x, self.cached_labels = self.feature_extractor.extract_features_in_dataset(dataset, is_test)
        else:
            x = self.cached_feauteres
        
        if(is_test):
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
        
        predicted_center = np.mean(x[y_predicted > 0], axis=0)
        similarities = cosine_similarity(x, np.reshape(predicted_center, (1, -1))).flatten()
        
        if(not threshold):
            threshold = calculate_similarity(similarities)
        
        return filter_similarity(similarities, threshold)