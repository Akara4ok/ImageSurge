from Pipeline import Pipeline
from utils.FileHandler import FileHandler, PipelineStage, ArtifactType
from utils.SklearnInterface import SklearnInterface
from ModelHandlers.ModelHandler import ModelHandler
import sys
sys.path.append("Dataset")
from TrainDataset import TrainDataset
import logging
import shutil

class OneClassClassificationTrain(Pipeline):
    """ Class for training one class classification """
    
    def __init__(self, file_handler: FileHandler) -> None:
        super().__init__(file_handler)
    
    def configure(self, feature_extractor: ModelHandler, one_class: SklearnInterface,
                  scaler: SklearnInterface = None, feature_reduction: SklearnInterface = None) -> None:
        """ Set elements for pipeline """
        
        self.feature_extractor = feature_extractor
        self.one_class = one_class
        self.scaler = scaler
        self.feature_reduction = feature_reduction
        
    def train(self, train_dataset: TrainDataset, epochs: int = None, 
              use_cache: bool = False, save_cache: bool = False) -> None:
        """ Train all pipeline stages """
        
        #train and extract features
        if(not use_cache or not self.cached_feauteres):    
            self.feature_extractor.train(train_dataset, epochs)
            X_train, _ = self.feature_extractor.extract_features_in_dataset(train_dataset.get_train_data())
        else:
            X_train = self.cached_feauteres
        
        if(save_cache):
            self.cache_features(X_train, None)
            
        logging.info("Feature extractor has been trained")
        
        # scale features
        if(self.scaler):
            X_train = self.scaler.fit_transform(X_train)
            logging.info("Features scaled")
        
        #dimension reduction
        if(self.feature_reduction):
            X_train = self.feature_reduction.fit_transform(X_train)
            logging.info("Dimensions reduced")
        
        #train one class classification
        self.one_class.fit(X_train)
        logging.info("One class classification training pipeline finished")
        
    
    def save(self) -> None:
        """ Save all pipeline artefacts """
        shutil.rmtree(self.file_handler.get_file_path(PipelineStage.BaseFolder, ArtifactType.BaseFolder))
        
        FileHandler.saveModelHandler(self.feature_extractor, 
                                     self.file_handler.get_file_path(PipelineStage.FeatureExtractor, ArtifactType.ModelHandler))
        
        if(self.scaler):
            FileHandler.saveSklearnModel(self.scaler, 
                                         self.file_handler.get_file_path(PipelineStage.Scaler, ArtifactType.SklearnModel))
        
        if(self.feature_reduction):
            FileHandler.saveSklearnModel(self.feature_reduction, 
                                         self.file_handler.get_file_path(PipelineStage.FeatureReduction, ArtifactType.SklearnModel))
        
        FileHandler.saveSklearnModel(self.one_class, 
                                     self.file_handler.get_file_path(PipelineStage.OneClass, ArtifactType.SklearnModel))