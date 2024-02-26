from Pipeline import Pipeline
from utils.FileHandler import FileHandler, PipelineStage, ArtifactType
from utils.SklearnInterface import SklearnInterface
from ModelHandlers.ModelHandler import ModelHandler
import sys
sys.path.append("Dataset")
from TrainDataset import TrainDataset

class OneClassClassificationTrain(Pipeline):
    """ Class for training one class classification """
    
    def __init__(self, image_width: int, image_height: int, random_seed: int, file_handler: FileHandler) -> None:
        super().__init__(image_width, image_height, random_seed, file_handler)
    
    def configure(self, feature_extractor: ModelHandler, one_class: SklearnInterface,
                  scaler: SklearnInterface = None, feature_reduction: SklearnInterface = None) -> None:
        """ Set elements for pipeline """
        
        self.feature_extractor = feature_extractor
        self.one_class = one_class
        self.scaler = scaler
        self.feature_reduction = feature_reduction
        
    def train(self, train_dataset: TrainDataset, epochs = None) -> None:
        """ Train all pipeline stages """
        
        #train and extract features
        self.feature_extractor.train(train_dataset, epochs)
        X_train, _ = self.feature_extractor(train_dataset.get_train_data())
        
        # scale features
        if(self.scaler):
            X_train = self.scaler.fit_transform(X_train)
        
        #dimension reduction
        if(self.feature_reduction):
            X_train = self.feature_reduction.fit_transform(X_train)
        
        #train one class classification
        self.one_class.fit(X_train)
    
    def save(self) -> None:
        """ Save all pipeline artefacts """
        
        FileHandler.saveModelHandler(self.feature_extractor, 
                                     self.file_handler.get_file_path(PipelineStage.FeatureExtractor, ArtifactType.ModelHandler))
        
        if(self.scaler):
            FileHandler.saveSklearnModel(self.scaler, 
                                         self.file_handler.get_file_path(PipelineStage.Scaler, ArtifactType.SklearnModel))
        
        if(self.feature_reduction):
            FileHandler.saveSklearnModel(self.feature_reduction, 
                                         self.file_handler.get_file_path(PipelineStage.FeatureReduction, ArtifactType.SklearnModel))
        
        FileHandler.saveModelHandler(self.one_class, 
                                     self.file_handler.get_file_path(PipelineStage.OneClass, ArtifactType.SklearnModel))