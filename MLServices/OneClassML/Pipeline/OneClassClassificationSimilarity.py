import tensorflow as tf
import numpy as np
import logging
from .Inference import Inference
from .OneClassClassificationInference import OneClassClassificationInference
from .utils.FileHandler import FileHandler
from utils.functions import calculate_similarity, filter_similarity
from sklearn.metrics.pairwise import cosine_similarity
from .ModelHandlers.KServeModel import KServeModel

class OneClassClassificationSimilarity(OneClassClassificationInference):
    """ Class for infernce one class classification using similarity """
    
    def __init__(self, file_handler: FileHandler, kserve_model: KServeModel = None) -> None:
        super().__init__(file_handler, kserve_model)
        self.threshold: float = 0
    
    @Inference.need_load
    def process(self, dataset: tf.data.Dataset, use_cache: bool = False,
                save_cache: bool = False, is_test: bool = False, threshold: float = None) -> np.ndarray:
        
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
            
        if(is_test):
            self.final_processed_features = x
        
        similarities = cosine_similarity(x, self.cluster_center).flatten()
        
        if(not threshold):
            self.threshold = calculate_similarity(similarities)
        else:
            self.threshold = threshold
        
        return filter_similarity(similarities, self.threshold)
    
    def get_threshold(self) -> float:
        """ Get threshold for similarities """
        return self.threshold