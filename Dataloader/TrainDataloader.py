from abc import  abstractmethod
from ImageDataloader import ImageDataloader

class TrainDataloader(ImageDataloader):
    """ Abstract class for train data loading """
    
    def __init__(self, base_folder_path: str):
        super().__init__(base_folder_path)
        
    @abstractmethod
    def get_train_images_paths(self) -> list[tuple[str, int]]:
        """ Load train images paths from folder and its label """
        pass