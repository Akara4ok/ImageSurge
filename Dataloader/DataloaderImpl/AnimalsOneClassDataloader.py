from abc import ABC, abstractmethod
import glob
import os
import sys
sys.path.append("Dataloader")
from OneClassDataloader import OneClassDataloader

class AnimalsOneClassDataloader(OneClassDataloader):
    """ Class for animal dataloading for one class tasks """
    
    def __init__(self, base_folder_path: str, target_class: str):
        super().__init__(base_folder_path)
        self.target_class = target_class
        
    def get_train_images_paths(self) -> list[tuple[str, int]]:
        paths = glob.glob(f'{self.base_folder_path}/train/{self.target_class}/*')
        labels = [1] * len(paths)
        return list(zip(paths, labels))
    
    def get_test_images_paths(self) -> list[tuple[str, int]]:
        classes = os.listdir(self.base_folder_path + "/val/")
        result_paths = []
        
        for cur_class in classes:
            cur_paths = glob.glob(f'{self.base_folder_path}/val/{cur_class}/*')
            cur_labels = [1] if cur_class == self.target_class else [0]
            cur_labels = cur_labels * len(cur_paths)
            result_paths = result_paths + list(zip(cur_paths, cur_labels))
        
        return result_paths