import tensorflow as tf
import numpy as np
from Inference import Inference
from utils.FileHandler import FileHandler, PipelineStage, ArtifactType
import sys
sys.path.append("utils")
from functions import to_numpy_image_label
import logging

class OneClassClassificationInference(Inference):
    """ Class for infernce one class classification """
    
    def __init__(self, file_handler: FileHandler) -> None:
        super().__init__(file_handler)
        
    def process(self, dataset: tf.data.Dataset) -> np.ndarray:
        """ Train all pipeline stages """
        
        if(not self.feature_extractor or not self.one_class):
            raise Exception("Inference not loaded models")
        
        x, self.y_true = self.feature_extractor.extract_features_in_dataset(dataset, self.is_train)
        logging.info("Feature extractor has been trained")
        
        if(self.is_train):
            self.cached_feauteres = x
        
        # scale features
        if(self.scaler):
            x = self.scaler.transform(x)
            logging.info("Features scaled")
        
        #dimension reduction
        if(self.feature_reduction):
            x = self.feature_reduction.transform(x)
            logging.info("Dimensions reduced")
        
        #train one class classification
        return self.one_class.predict(x)