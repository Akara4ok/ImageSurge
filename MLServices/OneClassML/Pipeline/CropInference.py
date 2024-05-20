import tensorflow as tf
import numpy as np
from .Inference import Inference
from .utils.FileHandler import FileHandler
from .ImageTable import ImageTableAlgo, ImageTable
from .ModelHandlers.KServeModel import KServeModel

class CropInference(Inference):
    """ Class for infernce one class classification """
    
    def __init__(self, file_handler: FileHandler,  small_box_count: int = 20, big_box_count: int = 5, kserve_model: KServeModel = None) -> None:
        super().__init__(file_handler, kserve_model)
        self.small_box_count = small_box_count
        self.big_box_count = big_box_count
        self.cached_img_tables: list[ImageTable] = []
        self.calc_similarity = 0
        
    def get_calc_similarity(self) -> float:
        """ Return similarity which calculated automatically """
        return self.calc_similarity
                

    @Inference.need_load
    def process(self, dataset: tf.data.Dataset, result_classification: list = None, algo: ImageTableAlgo = ImageTableAlgo.Similarity, 
                level: int = 15, use_cache: bool = False, save_cache: bool = False, is_test: bool = False, **kwargs) -> np.ndarray:
        
        if((self.feature_extractor is None and not use_cache) or self.cluster_center is None):
            raise Exception("Inference not loaded models")
        
        result: list[tuple[int, int, int, int]] = []
        features: list[np.ndarray] = []
        true_labels: list[np.ndarray] = []
        if(not use_cache or self.cached_feauteres is None):
            for i, data in enumerate(dataset):
                if(result_classification is not None and result_classification[i] == 0):
                    continue
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