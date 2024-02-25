import os
from pathlib import Path
from TrainDataloader import TrainDataloader

class MultiClassDataloader(TrainDataloader):
    """ Abstract class for multiclass data loading """
    
    def __init__(self, base_folder_path: str, classes_folder: str, label_path: str, save_labels: bool = False):
        super().__init__(base_folder_path)
        self.classes_folder = base_folder_path + "/" + classes_folder
        self.label_path = base_folder_path + "/" + label_path
        self.save_labels = save_labels
        self.labels = self.read_labels()
    
    def get_labels_count(self):
        return len(self.labels)
    
    def get_label(self, file_path: str) -> int:
        """ Get label from file_path """
        
        parts = file_path.split(os.path.sep)
        return self.labels.index(parts[-2])
    
    def read_labels(self) -> list[str]:
        """ Read labels from classes folder or create """
        
        if(os.path.isfile(self.label_path)):
            with open(self.label_path, 'r') as file:
                data = file.read()
                return data.split("\n")
            
        class_names = os.listdir(self.classes_folder)
        class_names.sort()
        if(self.save_labels):
            classes_str = '\n'.join(class_names)
            with open(self.label_path, "w") as file:
                file.write(classes_str)
            return
        return class_names