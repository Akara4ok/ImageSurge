import tensorflow as tf
import numpy as np
import cv2
import requests
from .Inference import Inference
from .CropInference import CropInference
from .utils.FileHandler import FileHandler
from .ImageTable import ImageTableAlgo, ImageTable
from .ModelHandlers.KServeModel import KServeModel

class KserveCropInference(Inference):
    """ Class for infernce one class classification """
    
    def __init__(self, file_handler: FileHandler,  small_box_count: int = 20, big_box_count: int = 5, kserve_model: KServeModel = None, url: str = "", token = None) -> None:
        super().__init__(file_handler, kserve_model)
        self.small_box_count = small_box_count
        self.big_box_count = big_box_count
        self.cached_img_tables: list[ImageTable] = []
        self.calc_similarity = 0
        self.url = url
        self.token = token
        self.max_elements_to_send = 1200
        
    def clone(self):
        """ Some fields are shallow coppied """
        result = KserveCropInference(self.file_handler, self.small_box_count, self.big_box_count, self.kserve_model, self.url, self.token)
        result.is_loaded = self.is_loaded
        result.feature_extractor = self.feature_extractor
        result.scaler = self.scaler
        result.feature_reduction = self.feature_reduction
        result.one_class = self.one_class
        result.cluster_center = self.cluster_center
        result.cached_feauteres = self.cached_feauteres
        result.cached_labels = self.cached_labels
        return result
        
    def get_calc_similarity(self) -> float:
        """ Return similarity which calculated automatically """
        return self.calc_similarity
    
    def create_request_data(self, batch: np.ndarray, result_classification, level, save_cahce, similarity, cluster_center) -> dict:
        """ Create data to send kserve endpoint """
        input_data: list[dict] = []
        for img in batch:
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]
            result, encimg = cv2.imencode('.jpg', img.numpy(), encode_param)
            input_data.append({"data": encimg.tolist()})
        result = {"instances": input_data,
                  "result_classification": result_classification,
                  "level": level,
                  "save_cache": save_cahce,
                  "cluster_center": cluster_center.tolist()
                  }
        if(similarity is not None):
            result["similarity"] = similarity
        
        return result
    
    def send_request(self, data):
        if(self.token is not None):
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
            
            response = requests.post(self.url, headers=headers, json=data)
        else:
            response = requests.post(self.url, json=data)
        
        result_resp = response.json()
        result = result_resp["result_crop"]
        similarity = result_resp["similarity"]
        features = None
        if(data["save_cache"]):
            features = result_resp["features"]
        return result, similarity, features
    
    def create_inference_from_features(self, dataset: tf.data.Dataset, features: np.ndarray):
        result = CropInference(None)
        result.is_loaded = True
        result.cluster_center = self.cluster_center
        
        result.cached_img_tables = []
        result.cached_feauteres = features
        for i, image in enumerate(dataset):
            image = image.numpy()
            img_table = ImageTable(image, self.small_box_count, self.big_box_count, self.cluster_center)
            result.cached_img_tables.append(img_table)
        return result
    
    @Inference.need_load
    def process(self, dataset: tf.data.Dataset, result_classification: list = None, algo: ImageTableAlgo = ImageTableAlgo.Similarity, 
                level: int = 15, use_cache: bool = False, save_cache: bool = False, is_test: bool = False, similarity=None) -> np.ndarray:
        result = []        
        similarity_from_kserve = []
        total_imgs = 0
        dataset = dataset.batch(self.max_elements_to_send)
        features = []
        for index, batch in enumerate(dataset):
            data = self.create_request_data(batch, result_classification[index * self.max_elements_to_send : (index + 1) * self.max_elements_to_send],
                                            level, save_cache, similarity, self.cluster_center)
            processed = self.send_request(data)
            result.extend(processed[0])
            similarity_from_kserve.append(processed[1] * len(processed[0]))
            total_imgs += len(processed[0])
            if(save_cache):
                features.append(processed[2])
        self.calc_similarity = sum(similarity_from_kserve) / total_imgs if total_imgs > 0 else None
        if(len(result) == 0):
            return
        if(save_cache):
            features = np.concatenate(np.asarray(features))
            self.cached_feauteres = features
        return np.asarray(result)