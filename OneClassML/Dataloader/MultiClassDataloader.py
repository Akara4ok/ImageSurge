import os
from .TrainDataloader import TrainDataloader

class MultiClassDataloader(TrainDataloader):
    """ Abstract class for multiclass data loading """
    
    def __init__(self, base_folder_path: str, classes_folder: str):
        super().__init__(base_folder_path)
        self.classes_folder = base_folder_path + "/" + classes_folder
        self.labels = self.read_labels()
    
    def get_labels_count(self):
        return len(self.labels)
    
    def get_label(self, file_path: str) -> int:
        """ Get label from file_path """
        
        parts = file_path.split(os.path.sep)
        return self.labels.index(parts[-2])
    
    def read_labels(self) -> list[str]:
        """ Read labels from classes folder or create """
            
        class_names = os.listdir(self.classes_folder)
        class_names.sort()
        return class_names