import glob
from ..MultiClassDataloader import MultiClassDataloader

class GeneralMultiClassDataloader(MultiClassDataloader):
    """ General class for dataloading for ref """
    
    def __init__(self, base_folder_path: str, classes_folder: str = ""):
        super().__init__(base_folder_path, classes_folder)
        
    def get_train_images_paths(self) -> list[tuple[str, int]]:
        paths = glob.glob(f'{self.base_folder_path}/*/*')
        paths.sort()
        labels = []
        for path in paths:
            labels.append(self.get_label(path))
        result = list(zip(paths, labels))
        return result