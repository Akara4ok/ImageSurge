from Pipeline import Pipeline
from utils.FileHandler import FileHandler, PipelineStage, ArtifactType
from abc import abstractmethod
import logging
import tensorflow as tf
import numpy as np

class Inference(Pipeline):
    """ Abstract inference class for different pipeline """
    
    def __init__(self, file_handler: FileHandler) -> None:
        super().__init__(file_handler)
    
    @abstractmethod
    def process(data: tf.data.Dataset) -> np.ndarray:
        """ Process dataset """
        pass
    
    def load(self) -> None:
        """ Load models """
        
        self.feature_extractor =  FileHandler.loadModelHandler(self.file_handler.get_file_path(PipelineStage.FeatureExtractor, 
                                                                                               ArtifactType.ModelHandler))
        
        self.scaler = FileHandler.loadSklearnModel(self.file_handler.get_file_path(PipelineStage.Scaler, 
                                                                        ArtifactType.SklearnModel))
        
        self.feature_reduction = FileHandler.loadSklearnModel(self.file_handler.get_file_path(PipelineStage.FeatureReduction, 
                                                                                                ArtifactType.SklearnModel))
        
        self.one_class = FileHandler.loadSklearnModel(self.file_handler.get_file_path(PipelineStage.OneClass, 
                                                                                      ArtifactType.SklearnModel))