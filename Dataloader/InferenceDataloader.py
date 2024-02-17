import os
from ImageDataloader import ImageDataloader

class InferenceDataloader(ImageDataloader):
    """ Implementation of dataloader for user requests """
    
    def __init__(self, base_folder_path: str):
        super().__init__(base_folder_path)
    
    def get_images_paths(self) -> list[str]:
        """ Load images paths from folder """
        
        return os.listdir(self.base_folder_path)