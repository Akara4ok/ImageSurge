from abc import ABC

class ImageDataloader(ABC):
    """ Abstract class for image data loading """
    
    def __init__(self, base_folder_path: str):
        self.base_folder_path = base_folder_path