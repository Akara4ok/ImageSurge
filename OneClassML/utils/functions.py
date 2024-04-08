""" Some usefull functions """
import tensorflow as tf
import os
import numpy as  np
import requests
from sklearn.base import ClusterMixin
from sklearn.metrics.pairwise import cosine_similarity
from kneed import KneeLocator

def to_numpy_image(dataset: tf.data.Dataset) -> np.ndarray:
    """ Converts to numpy dataset contains images with processing """
    x = []
    
    for img in dataset:
        x += img.numpy().tolist()
    
    x = np.asarray(x)
    return x

def to_numpy_image_label(dataset: tf.data.Dataset) -> tuple[np.ndarray, np.ndarray]:
    """ Converts to numpy dataset contains images, labels with image processing """
    x = []
    y = []
    
    for img, label in dataset:
        x += img.numpy().tolist()
        y += label.numpy().tolist()
    
    x = np.asarray(x)
    y = np.asarray(y)
    return x, y

def unzip_list(cur_list: list[tuple[str, int]]) -> tuple[list[str], list[int]]:
    """ Unzip list of tuples """
    
    if(len(cur_list) == 0):
        return ([], [])
    
    list_unzipped = [list(t) for t in zip(*cur_list)]
    return list_unzipped[0], list_unzipped[1]

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

def get_cluster_label(features: np.ndarray, cluster_labels: np.ndarray, cluster_center: np.ndarray) -> int:
    """ Get a label of true class from clustering"""
    
    n_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
    if(n_clusters == 0):
        return -1
    cluster_centers = []
    for i in range(n_clusters):
        cluster_centers.append(np.mean(features[cluster_labels == i], axis=0))
    cluster_centers = np.asarray(cluster_centers)
    sim = cosine_similarity(cluster_centers, cluster_center).flatten()
    return np.argmax(sim)

def get_cluster_num(cluster_engine: ClusterMixin, cropped_features: np.ndarray, max_kernels: int) -> int:
    """ Get cluster num """
    sse = []
    for k in range(1, max_kernels + 1):
        clustering = cluster_engine(n_clusters=k)
        clustering.fit(cropped_features)
        sse.append(clustering.inertia_)
    return KneeLocator(range(1, 11), sse, curve="convex", direction="decreasing").elbow


def get_square(tl: tuple[int, int], br: tuple[int, int]) -> int:
        """ Get square of rectangle """
        return abs((tl[0] - br[0]) * (tl[1] - br[1]))

def overlap_square(tl: tuple[int, int], br: tuple[int, int], tl_ref: tuple[int, int], br_ref: tuple[int, int]) -> int:
    """ Overlap square of 2 rectangles """
    x_overlap = max(0, min(br[0], br_ref[0]) - max(tl[0], tl_ref[0]))
    y_overlap = max(0, min(br[1], br_ref[1]) - max(tl[1], tl_ref[1]))
    overlapArea = x_overlap * y_overlap
    return overlapArea

def union_square(tl: tuple[int, int], br: tuple[int, int], tl_ref: tuple[int, int], br_ref: tuple[int, int]) -> int:
    """ union square of 2 rectangles """
    sample_square = get_square(tl, br)
    ref_square = get_square(tl_ref, br_ref)
    overlap = overlap_square(tl, br, tl_ref, br_ref)
    return sample_square + ref_square - overlap

def recrop(x: np.ndarray, width: int, height: int, ref_width: int, ref_height) -> np.ndarray:
    """ Recrop bbox from one size to ref size """
    
    arr_copy = np.copy(x)
    arr_copy[:, 0] = (arr_copy[:, 0] / width) * ref_width
    arr_copy[:, 1] = (arr_copy[:, 1] / height) * ref_height
    arr_copy[:, 2] = (arr_copy[:, 2] / width) * ref_width
    arr_copy[:, 3] = (arr_copy[:, 3] / height) * ref_height
    return arr_copy