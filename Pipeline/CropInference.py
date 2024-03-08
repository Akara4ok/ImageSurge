import tensorflow as tf
import numpy as np
from .Inference import Inference
from .utils.FileHandler import FileHandler
from .ImageTable import ImageTableAlgo, ImageTable

class CropInference(Inference):
    """ Class for infernce one class classification """
    
    def __init__(self, file_handler: FileHandler, image_width, image_height,  small_box_count: int = 20, big_box_count: int = 5) -> None:
        super().__init__(file_handler)
        self.small_box_count = small_box_count
        self.big_box_count = big_box_count
        self.image_width: int = image_width
        self.image_height: int = image_height
        self.cached_img_tables: list[ImageTable] = []
        self.calc_similarity = 0
        
    def get_calc_similarity(self) -> float:
        """ Return similarity which calculated automatically """
        return self.calc_similarity
    
    @Inference.need_load
    def process(self, dataset: tf.data.Dataset, algo: ImageTableAlgo = ImageTableAlgo.Similarity, 
                level: int = 15, use_cache: bool = False, save_cache: bool = False, is_test: bool = False, **kwargs) -> np.ndarray:
        
        if(self.feature_extractor is None or self.cluster_center is None):
            raise Exception("Inference not loaded models")
        
        result: list[tuple[int, int, int, int]] = []
        features: list[np.ndarray] = []
        true_labels: list[np.ndarray] = []
        if(not use_cache or self.cached_feauteres is None):
            for data in dataset:
                if(is_test):
                    image = data[0]
                else:
                    image = data
                image = image.numpy()
                img_table = ImageTable(image, self.small_box_count, self.big_box_count, self.cluster_center)
                crop_boxes = img_table.crop_images_to_boxes()
                extracted_features = self.feature_extractor.extract_features(crop_boxes)
                crop_bbox = img_table.get_crop_bbox(extracted_features, level, algo, **kwargs)
                if(algo == ImageTableAlgo.Similarity and img_table.calc_similarity is not None):
                    self.calc_similarity += img_table.calc_similarity
                result.append(crop_bbox)
                if(save_cache):
                    features.append(extracted_features)
                    self.cached_img_tables.append(img_table)
                    true_labels.append(data[1].numpy())
                    
            if(algo == ImageTableAlgo.Similarity and self.calc_similarity is not None):      
                self.calc_similarity /= len(dataset)
                
            if(save_cache):
                self.cached_feauteres = np.asarray(features)
                self.cached_labels = np.asarray(true_labels)
        else:
            for ind, features in enumerate(self.cached_feauteres):
                crop_bbox = self.cached_img_tables[ind].get_crop_bbox(features, level, algo, **kwargs)
                result.append(crop_bbox)
            
        return np.asarray(result)