""" Some usefull functions """
import tensorflow as tf
import numpy as  np

def to_numpy_image_label(dataset: tf.data.Dataset) -> tuple[np.ndarray, np.ndarray]:
    """ Converts to numpy dataset contains images, labels with image processing """
    x = []
    y = []
    
    for img, label in dataset:
        x.append(img.numpy())
        y.append(label.numpy())
    
    x = np.concatenate(np.asarray(x))
    y = np.concatenate(np.asarray(x))
    return x, y