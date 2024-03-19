from abc import abstractmethod
from typing import Callable
import tensorflow as tf
import numpy as np
from .Pipeline import Pipeline
from .ModelHandlers.KServeModel import KServeModel
from .utils.FileHandler import FileHandler, PipelineStage, ArtifactType

class Inference(Pipeline):
    """ Abstract inference class for different pipeline """
    
    def __init__(self, file_handler: FileHandler, kserve_model: KServeModel = None) -> None:
        super().__init__(file_handler)
        self.is_loaded = False
        self.kserve_model = kserve_model
    
    @abstractmethod
    def process(data: tf.data.Dataset) -> np.ndarray:
        """ Process dataset """
        pass
    
    def need_load(func: Callable) -> Callable:
        """ check is data loaded """
        def load_decorator(self, *args, **kwargs):
            if(not self.is_loaded):
                self.load()
                if(not self.is_loaded):
                    raise Exception("Load failed")
            return func(self, *args, **kwargs)
        return load_decorator
    
    def load(self) -> None:
        """ Load models """
        
        if(self.kserve_model is not None):
            self.feature_extractor =  self.kserve_model
        else:
            self.feature_extractor =  FileHandler.loadModelHandler(self.file_handler.get_file_path(PipelineStage.FeatureExtractor, 
                                                                                            ArtifactType.ModelHandler))
        
        self.scaler = FileHandler.loadSklearnModel(self.file_handler.get_file_path(PipelineStage.Scaler, 
                                                                        ArtifactType.SklearnModel))
        
        self.feature_reduction = FileHandler.loadSklearnModel(self.file_handler.get_file_path(PipelineStage.FeatureReduction, 
                                                                                                ArtifactType.SklearnModel))
        
        self.one_class = FileHandler.loadSklearnModel(self.file_handler.get_file_path(PipelineStage.OneClass, 
                                                                                      ArtifactType.SklearnModel))
        
        self.cluster_center = FileHandler.loadNumpyArray(self.file_handler.get_file_path(PipelineStage.ClusterCenter, 
                                                                                      ArtifactType.NumpyArray))
        
        self.is_loaded = True