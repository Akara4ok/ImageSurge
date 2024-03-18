from abc import  abstractmethod
from .TrainDataloader import TrainDataloader

class OneClassDataloader(TrainDataloader):
    """ Abstract class for train data loading """
    
    def __init__(self, base_folder_path: str):
        super().__init__(base_folder_path)
        
    @abstractmethod
    def get_test_images_paths(self) -> list[tuple[str, int]]:
        """ Load test images paths from folder and its label """
        pass