from utils.FileHandler import FileHandler
from utils.SklearnInterface import SklearnInterface
from ModelHandlers.ModelHandler import ModelHandler

class Pipeline:
    """ Abstract class for training, testing and inference pipeline """
    def __init__(self, image_width: int, image_height: int, random_seed: int, file_handler: FileHandler) -> None:
        self.image_width = image_width
        self.image_height = image_height
        self.random_seed = random_seed
        self.file_handler = file_handler
        self.feature_extractor: ModelHandler = None
        self.scaler: SklearnInterface = None
        self.feature_reduction: SklearnInterface = None
        self.one_class: SklearnInterface = None