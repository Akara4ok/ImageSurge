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

def calculate_similarity(similarities: np.ndarray, min_std: float = 0.01, max_std: float = 0.3) -> float:
    """ Calculate suggested similarity """
    std = np.std(similarities)
    percent_std = (std - min_std) / (max_std - min_std)
    mean = np.mean(similarities)
    max_sim = np.max(similarities)
    result = (1 - percent_std) * mean + max_sim * percent_std
    return result

def filter_similarity(similarities: np.ndarray, threshold: float) -> np.ndarray:
    """ Threshod similarities array """
    
    result = similarities > threshold
    return result.astype(int)