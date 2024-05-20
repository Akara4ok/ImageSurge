import requests
import cv2
import numpy as np
import tensorflow as tf
from .PreTrainedModel import PreTrainedModel
from utils.functions import to_numpy_image, to_numpy_image_label

class KServeModel(PreTrainedModel):
    """ Class for pretrained keras models """
    
    def __init__(self, url: str, token: str, max_elements_to_send: int = 1200) -> None:
        super().__init__()
        self.url = url
        self.max_elements_to_send = max_elements_to_send
        self.token = token
    
    def preprocess(self, batch: tf.Tensor) -> tf.Tensor:
        if(len(batch.shape) == 3):
            batch = tf.expand_dims(batch, axis=0)
        if(isinstance(batch, np.ndarray)):
            return batch
        return batch.numpy()
    
    def create_request_data(self, batch: np.ndarray) -> dict:
        """ Create data to send kserve endpoint """
        
        input_data: list[dict] = []
        for img in batch:
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 95]
            result, encimg = cv2.imencode('.jpg', img, encode_param)
            input_data.append({"data": encimg.tolist()})
        return {"instances": input_data}
    
    def send_request(self, data):
        if(self.token is not None):
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.token}"
            }
            
            response = requests.post(self.url, headers=headers, json=data)
        else:
            response = requests.post(self.url, json=data)
            
        result = response.json()
        result = np.asarray(result["features"])
        return result
    
    def extract_features(self, batch: tf.Tensor) -> tf.Tensor:
        batch = self.preprocess(batch)
        data = self.create_request_data(batch)
        return self.send_request(data)
    
    def extract_features_in_dataset_priv(self, dataset: tf.data.Dataset, is_train_ds: bool = True) -> tuple[np.ndarray, np.ndarray]:
        """ Process several batches """
        def full_process_x(x: tf.Tensor) -> tf.Tensor:
            processed_x = self.preprocess(x)
            features = self.extract_features(processed_x)
            return features
        
        def full_process(x: tf.Tensor, y: tf.Tensor) -> tf.Tensor:
            return full_process_x(x), tf.cast(y, tf.float32)
        
        dataset = dataset.unbatch()
        dataset = dataset.batch(self.max_elements_to_send)
        
        if(is_train_ds):
            feature_ds = dataset.map(lambda x, y: tf.py_function(full_process, [x, y], [tf.float32, tf.float32]))
            return to_numpy_image_label(feature_ds)
        
        feature_ds = dataset.map(lambda x: tf.py_function(full_process_x, [x], tf.float32))
        return to_numpy_image(feature_ds), None
    
    def get_batch_size(self, dataset: tf.data.Dataset, is_train_ds: bool = True) -> int:
        if(is_train_ds):
            for one_batch_x, _ in dataset:
                if(len(one_batch_x.shape) == 3):
                    return 1
                return one_batch_x.shape[0]
        
        for one_batch_x in dataset:
            if(len(one_batch_x.shape) == 3):
                return 1
            return one_batch_x.shape[0]
        
    
    def extract_features_in_dataset(self, dataset: tf.data.Dataset, is_train_ds: bool = True) -> tuple[np.ndarray, np.ndarray]:      
        result_x = None
        result_y = None
        
        dataset_len = len(dataset)
        batch_size = self.get_batch_size(dataset, is_train_ds)
        batch_count_in_send = self.max_elements_to_send // batch_size
        for i in range(0, dataset_len, batch_count_in_send):
            sub_dataset = dataset.take(batch_count_in_send)
            result = self.extract_features_in_dataset_priv(sub_dataset, is_train_ds)
            if(result_x is None):
                result_x = result[0]
            else:
                result_x = np.concatenate((result_x, result[0]))
            
            if(result_y is None):
                result_y = result[1]
            else:
                result_y = np.concatenate((result_y, result[1]))
            dataset = dataset.skip(batch_count_in_send)
        return result_x, result_y
    
    def save(self, save_path: str) -> None:
        pass
    
    def load(self, load_path: str = None) -> None:
        pass