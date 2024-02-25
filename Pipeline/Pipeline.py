import sys
from utils.FileHandler import FileHandler

class Pipeline:
    """ Abstract class for training, testing and inference pipeline """
    def __init__(self, image_width: int, image_height: int, random_seed: int, file_handler: FileHandler) -> None:
        self.image_width = image_width
        self.image_height = image_height
        self.random_seed = random_seed
        self.file_handler = file_handler
        