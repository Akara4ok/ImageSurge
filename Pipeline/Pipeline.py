from utils.FileHandler import FileHandler
from utils.SklearnInterface import SklearnInterface
from ModelHandlers.ModelHandler import ModelHandler

class Pipeline:
    """ Abstract class for training, testing and inference pipeline """
    def __init__(self, file_handler: FileHandler) -> None:
        self.file_handler = file_handler
        self.feature_extractor: ModelHandler = None
        self.scaler: SklearnInterface = None
        self.feature_reduction: SklearnInterface = None
        self.one_class: SklearnInterface = None