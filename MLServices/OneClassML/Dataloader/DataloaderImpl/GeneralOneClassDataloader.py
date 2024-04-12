import glob
import os
import random
from ..OneClassDataloader import OneClassDataloader

class GeneralOneClassDataloader(OneClassDataloader):
    """ General class for one class tasks """
    
    def __init__(self, base_folder_path: str, target_class: str, train_percent: float, random_seed: int = 42):
        super().__init__(base_folder_path)
        self.target_class = target_class
        self.train_percent = train_percent
        self.random_seed = random_seed
        
    def get_train_images_paths(self) -> list[tuple[str, int]]:
        paths = glob.glob(f'{self.base_folder_path}/{self.target_class}/*')
        paths_size = int(len(paths) * self.train_percent)
        random.Random(self.random_seed).shuffle(paths)
        paths = paths[:paths_size]
        labels = [1] * paths_size
        return list(zip(paths, labels))
    
    def get_test_images_paths(self) -> list[tuple[str, int]]:
        classes = os.listdir(self.base_folder_path)
        result_paths = []
        
        for cur_class in classes:
            cur_paths = glob.glob(f'{self.base_folder_path}/{cur_class}/*')
            if(cur_class == self.target_class):
                random.Random(self.random_seed).shuffle(cur_paths)
                cur_paths = cur_paths[int(len(cur_paths) * self.train_percent):]
            
            cur_labels = [1] if cur_class == self.target_class else [0]
            cur_labels = cur_labels * len(cur_paths)
            result_paths = result_paths + list(zip(cur_paths, cur_labels))
        
        return result_paths