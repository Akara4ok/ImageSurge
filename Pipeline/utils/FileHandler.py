import enum
import sys
import pickle

model_path_suffix = "_metainfo"

sys.path.append("utils")
from ExperimentInfo import ExperimentInfo
sys.path.append("Pipeline")
from ModelHandlers.ModelHandler import ModelHandler
from ModelHandlers.ModelLoader import ModelLoader
from SklearnInterface import SklearnInterface
from pathlib import Path

from sklearn.base import BaseEstimator

class ArtifactType(enum.Enum):
    BaseFolder = 1
    ModelHandler = 2
    SklearnModel = 3

class PipelineStage(enum.Enum):
    BaseFolder = 1
    FeatureExtractor = 2,
    Scaler = 3
    FeatureReduction = 4
    OneClass = 5

class FileHandler:
    """ Class for saving and loading files """
    def __init__(self, base_folder_dir: str, experiment_info: ExperimentInfo) -> None:
        self.base_folder_dir = base_folder_dir
        self.experiment_info = experiment_info
        
    def saveModelHandler(model: ModelHandler, path: str) -> None:
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        model.save(path)
    
    def saveSklearnModel(model: BaseEstimator, path: str) -> None:
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        pickle.dump(model, open(path, 'wb'))
    
    def saveUndefinedModel(model, path: str) -> None:
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        pickle.dump(model, open(path, 'wb'))
        
    def loadModelHandler(path: str) -> ModelHandler:
        try:
            return ModelLoader.load(path)
        except:
            return None
    
    def loadSklearnModel(path: str) -> SklearnInterface:
        try:
            return pickle.load(open(path, 'rb'))
        except:
            return None
    
    def loadUndefinedModel(model, path: str):
        try:
            return pickle.load(open(path, 'rb'))
        except:
            return None
        
    def get_file_path(self, pipeline_stage: PipelineStage, artifact_type: ArtifactType) -> str:
        """ get file path for specific experiment and file """
        folder = f"{self.base_folder_dir}/{self.experiment_info.to_path()}"
        name = ""
        match pipeline_stage:
            case PipelineStage.BaseFolder:
                name = ""
            case PipelineStage.FeatureExtractor:
                name = "feature_extractor" + model_path_suffix
            case PipelineStage.Scaler:
                name = "scaler"
            case PipelineStage.FeatureReduction:
                name = "feature_reduction"
            case PipelineStage.OneClass:
                name = "one_class_model"
            case _:
                raise Exception(f"Undefined stage {pipeline_stage}")
        
        ext = ""
        match artifact_type:
            case ArtifactType.BaseFolder:
                ext = ""
            case ArtifactType.ModelHandler:
                ext = ".json"
            case ArtifactType.SklearnModel:
                ext = ".sklearn"
            case _:
                ext = ".model"
            
        return folder + name + ext