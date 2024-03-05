import tensorflow as tf
import numpy as np
from .Inference import Inference
from .utils.FileHandler import FileHandler
from .ImageTable import ImageTableAlgo, ImageTable

class CropInference(Inference):
    """ Class for infernce one class classification """
    
    def __init__(self, file_handler: FileHandler, small_box_count: int = 20, big_box_count: int = 5) -> None:
        super().__init__(file_handler)
        self.small_box_count = small_box_count
        self.big_box_count = big_box_count
    
    @Inference.need_load
    def process(self, dataset: tf.data.Dataset | np.ndarray, algo: ImageTableAlgo = ImageTableAlgo.Similarity, 
                level: int = 15, is_test: bool = False, **kwargs) -> np.ndarray:
        
        if(not self.feature_extractor or not self.cluster_center):
            raise Exception("Inference not loaded models")
        
        result: list[tuple[int, int, int, int]] = []
        true_labels: list[np.ndarray] = []
        
        for data in dataset:
            if(is_test):
                image = data[0]
                true_labels.append(data[1].numpy())
            else:
                image = data
            image = image.numpy()
            img_table = ImageTable(image, self.small_box_count, self.big_box_count, self.cluster_center)
            crop_boxes = img_table.crop_images_to_boxes()
            features = self.feature_extractor.extract_features(crop_boxes)
            crop_bbox = img_table.get_crop_bbox(features, level, algo, **kwargs)
            result.append(crop_bbox)
            
        if(is_test):
            self.cached_labels = np.asarray(true_labels)
        
        return np.asarray(result)