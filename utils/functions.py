""" Some usefull functions """
import tensorflow as tf
import numpy as  np

def to_numpy_image(dataset: tf.data.Dataset) -> np.ndarray:
    """ Converts to numpy dataset contains images with processing """
    x = []
    
    for img in dataset:
        x.append(img.numpy())
    
    x = np.concatenate(np.asarray(x))
    return x

def to_numpy_image_label(dataset: tf.data.Dataset) -> tuple[np.ndarray, np.ndarray]:
    """ Converts to numpy dataset contains images, labels with image processing """
    x = []
    y = []
    
    for img, label in dataset:
        x.append(img.numpy())
        y.append(label.numpy())
    
    x = np.concatenate(np.asarray(x))
    y = np.concatenate(np.asarray(y))
    return x, y