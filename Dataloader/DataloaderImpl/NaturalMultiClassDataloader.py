from abc import ABC, abstractmethod
import glob
import os
import sys
sys.path.append("Dataloader")
from MultiClassDataloader import MultiClassDataloader

class NaturalMultiClassDataloader(MultiClassDataloader):
    """ Class for natural dataloading for ref """
    
    def __init__(self, base_folder_path: str, classes_folder: str, label_path: str, save_labels: bool = False):
        super().__init__(base_folder_path, classes_folder, label_path, save_labels)
        
    def get_train_images_paths(self) -> list[tuple[str, int]]:
        paths = glob.glob(f'{self.base_folder_path}/natural_images/*/*')
        paths.sort()
        labels = []
        for path in paths:
            labels.append(self.get_label(path))
        result = list(zip(paths, labels))
        return result