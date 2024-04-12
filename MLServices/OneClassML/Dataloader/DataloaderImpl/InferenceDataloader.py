from __future__ import annotations
import glob
from ..OneClassDataloader import OneClassDataloader

class InferenceDataloader(OneClassDataloader):
    """ Implementation of dataloader for user requests """
    
    def __init__(self, base_folder_path: str = None):
        super().__init__(base_folder_path)
        self.folders: list[str] = []
        if(base_folder_path is not None):
            self.folders.append(base_folder_path)
    
    def add_folder(self, path: str) -> None:
        self.folders.append(path)
    
    def create_from_multiple_paths(paths: list[str]) -> InferenceDataloader:
        dataloader = InferenceDataloader()
        for path in paths:
            dataloader.add_folder(path)
        return dataloader
        
    def get_images_paths(self) -> list[str]:
        result_paths = []
        for path in self.folders:
            result_paths += glob.glob(f'{path}/*')
        return result_paths
        
    def get_train_images_paths(self) -> list[tuple[str, int]]:
        paths = self.get_images_paths()
        labels = [1] * len(paths)
        return list(zip(paths, labels))
    
    def get_test_images_paths(self) -> list[tuple[str, int]]:
        return []