import hashlib
import numpy as np 
import tensorflow as tf
import sys
import cv2
import time
sys.path.append("OneClassML")
from Pipeline.Inference import Inference
from Pipeline.OneClassClassificationInference import OneClassClassificationInference
from Pipeline.CropInference import CropInference
from Pipeline.KserveCropInference import KserveCropInference
from Pipeline.utils.FileHandler import FileHandler
from utils.ExperimentInfo import ExperimentInfo
from Dataset.InferenceImageDataset import InferenceImageDataset
from Pipeline.ModelHandlers.KServeModel import KServeModel
from PostProcessings import applyPostprocessingToAll
from utils.functions import recrop_1d

IMAGE_HEIGHT = 224
IMAGE_WIDTH = 224

class InferenceHandler:
    """ Class for saving loaded inference and processing pipeline """
    def __init__(self, default_folder: str, batch_size: int = 10, validation_folder: str = "Services/Validation") -> None:
        self.default_folder = default_folder
        self.iference_map: dict[str, Inference] = {}
        self.batch_size = batch_size
        self.validation_folder = validation_folder
        
    def getKey(self, user: str, project: str, experiment_str: str, cropping: bool):
        if(cropping):
            crop_suffix = "-crop"
        else:
            crop_suffix = ""
        return hashlib.sha256((user + project + experiment_str + crop_suffix).encode('utf-8')).hexdigest()
            
    def load(self, user: str, project: str, experiment_str: str, cropping: bool, 
             kserve_classification_path: str = None, kserve_crop_path: str = None, 
             token: str = None) -> bool:
        key = self.getKey(user, project, experiment_str, False)
        
        experiment = ExperimentInfo(user, project, experiment_str)
        file_handler = FileHandler(self.default_folder, experiment)
        kserve_classification = None
        if(kserve_classification_path is not None):
            kserve_classification = KServeModel(kserve_classification_path, token)
        inference = OneClassClassificationInference(file_handler, kserve_classification)
        inference.load()
        
        if(not inference.is_loaded):
            print("Error during loaded")
            return False
        
        if(cropping):
            key_crop = self.getKey(user, project, experiment_str, True)
            experiment_crop = ExperimentInfo(user, project, experiment_str + "-crop")
            file_handler_crop = FileHandler(self.default_folder, experiment_crop)
            kserve_crop = None
            if(kserve_crop_path is not None):
                kserve_crop = KServeModel(kserve_crop_path, token)
                inference_crop = KserveCropInference(file_handler_crop, kserve_model=kserve_crop, url=kserve_crop_path, token=token)
            else: 
                inference_crop = CropInference(file_handler_crop, kserve_model=kserve_crop)
            inference_crop.load()
            
            if(not inference_crop.is_loaded):
                return False
            
            self.iference_map[key_crop] = inference_crop
        self.iference_map[key] = inference
        return True
    
    def stop(self, user: str, project: str, experiment_str: str, cropping: bool):
        key = self.getKey(user, project, experiment_str, False)
        
        if(key not in self.iference_map.keys()):
            return False
        
        if(cropping):
            key_crop = self.getKey(user, project, experiment_str, True)
            if(key not in self.iference_map.keys()):
                self.iference_map.pop(key)  
                return False
            self.iference_map.pop(key_crop)
        
        self.iference_map.pop(key)  
        return True
    
    def validate(self, images: tf.data.Dataset) -> list[float]:
        result = []
        for image in images:
            image = image.numpy()
            score = cv2.quality.QualityBRISQUE_compute(image, self.validation_folder + "/brisque_model_live.yml", 
                                                       self.validation_folder + "/brisque_range_live.yml")
            result.append(score[0])
        return np.asarray(result)

    def process(self, images: list[np.ndarray], user: str, project: str, experiment_str: str, cropping: bool,
                level: int = 15, similarity: int = None) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        
        inference_key = self.getKey(user, project, experiment_str, False)
        if(not(inference_key in self.iference_map)):
            print("Inference is not loaded")
            return None
        
        if(cropping):
            inference_crop_key = self.getKey(user, project, experiment_str, True)
            if(not(inference_crop_key in self.iference_map)):
                print("Inference Crop is not loaded")
                return None
        
        dataset = InferenceImageDataset(IMAGE_HEIGHT, IMAGE_WIDTH)
        dataset.load(images)
        
        validation_time = time.time()
        quality = self.validate(dataset.get_data())
        validation_time = time.time() - validation_time
        
        inference = self.iference_map[inference_key]
        
        classification_time = time.time()
        result = inference.process(dataset.get_data().batch(self.batch_size))
        classification_time = time.time() - classification_time
        
        result_crop = None
        cropping_time = None
        if(cropping):
            inference_crop = self.iference_map[inference_crop_key]
            cropping_time = time.time()
            result_crop = inference_crop.process(dataset.get_data(), result_classification = result.tolist(), 
                                                 level = level, similarity = similarity)
            cropping_time = time.time() - cropping_time
            if(result_crop is not None):
                recropped = []
                for index, crop in enumerate(result_crop):
                    was_width, was_height = images[index].shape[:2]
                    recropped.append(recrop_1d(crop, IMAGE_WIDTH, IMAGE_HEIGHT, was_width, was_height))
                
                result_crop = np.asarray(recropped)
        
        return (result, quality, result_crop, validation_time, classification_time, cropping_time)
    
    def postprocess(self, images: list[np.ndarray], postprocessings: list[str], result_class: np.ndarray, cropping: np.ndarray) -> list[np.ndarray]:
        processed = []
        if(cropping is not None):
            cropping_op = "cropping" 
            postprocessings.insert(0, cropping_op)
        for index, image in enumerate(images):
            if(result_class[index] != 1):
                continue
            processed.append(image)
        for postProcess in postprocessings:
            processed = applyPostprocessingToAll(processed, postProcess, cropping)
        
        result = []
        for img in processed:
            result_encode, buffer = cv2.imencode('.jpg', img)
            if(result_encode):
                result.append(buffer)
        return result