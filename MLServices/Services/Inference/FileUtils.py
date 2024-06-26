""" Util class to work with files """
import sys
import io
import cv2
import numpy as np
from PIL import Image, ImageOps
import json
import zipfile
import io
import tensorflow as tf

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/bmp"}

def processFiles(files: list) -> tuple[list[np.ndarray], str]:
    """ Process array of images """
    images = []
    filenames = []
    for file in files:
        if (file.content_type not in ALLOWED_CONTENT_TYPES):
            continue

        try:
            img = tf.io.decode_jpeg(file.stream.read(), channels=3)
            img = tf.reverse(img, axis=[-1])
            img = tf.image.resize(img, [224, 224])
            img = tf.cast(img, tf.uint8)
            img = img.numpy()
        except:
            continue
            
        images.append(img)
        filenames.append(file.filename)

    return (images, filenames)

def create_result_zip(result_classification: np.ndarray, quality: np.ndarray, result_crop: np.ndarray, 
                      validation_time: float, classification_time: float, cropping_time: float, 
                      images_names: list, images: list):
    if(np.sum(result_classification) != len(images)):
        return
    
    json_dict = {
        "result_classification": result_classification.tolist(),
        "quality": quality.tolist(),
        "validation_time": validation_time,
        "classification_time": classification_time,
        "cropping_time": cropping_time,
    }
    if(result_crop is not None):
        json_dict["result_crop"] = result_crop.tolist()
        
    data = io.BytesIO()
    
    truncated_names = []
    for index, res in enumerate(result_classification):
        if res == 1:
            truncated_names.append(images_names[index])
    
    with zipfile.ZipFile(data, mode='w') as z:
        z.writestr('metainfo.json', json.dumps(json_dict))
        for index, img in enumerate(images):
            z.writestr(truncated_names[index], img)

    data.seek(0)
    return data

