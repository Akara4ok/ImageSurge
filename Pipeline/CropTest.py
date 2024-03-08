import numpy as np
import tensorflow as tf
import cv2
import matplotlib.pyplot as plt
from .Testable import Testable
from .CropInference import CropInference
from .ImageTable import ImageTableAlgo
from utils.functions import get_square, union_square, overlap_square, recrop

class CropTest(Testable):
    """ Class for testing cropping """
    
    def __init__(self, test_inference: CropInference) -> None:
        self.test_inference: CropInference = test_inference
        self.y_predicted: np.ndarray = None
        
    def test(self, dataset: tf.data.Dataset, algo: ImageTableAlgo = ImageTableAlgo.Similarity, 
             level: int = 15, use_cache: bool = False, **kwargs) -> np.ndarray:
        """ Testing inference """
        
        self.y_predicted = self.test_inference.process(dataset, algo, level, use_cache, True, True, **kwargs)
        return self.y_predicted 
    
    def get_metrics(self) -> dict[str, float]:
        y_true = self.test_inference.get_cache_data()[1]
        width = y_true[0][4]
        height = y_true[0][5]
        y_true = recrop(y_true[:, :4], width, height, self.test_inference.image_width, self.test_inference.image_height)
        precision = 0
        recall = 0
        accuracy = 0
        dice = 0
        IoU = 0
        for row in range(y_true.shape[0]):
            tl = (self.y_predicted[row][0], self.y_predicted[row][1])
            br = (self.y_predicted[row][2], self.y_predicted[row][3])
            
            tl_ref = (y_true[row][0], y_true[row][1])
            br_ref = (y_true[row][2], y_true[row][3])
            
            sample_square = get_square(tl, br)
            ref_square = get_square(tl_ref, br_ref)
            
            tp = overlap_square(tl, br, tl_ref, br_ref)
            tn = max(width * height - union_square(tl, br, tl_ref, br_ref), 0)
            fp = max(sample_square - tp, 0)
            fn = max(ref_square - tp, 0)
            
            precision += tp / (tp + fp)
            recall += tp / (tp + fn)
            accuracy += (tp + tn) / (tp + tn + fn + fp)
            dice += 2 * tp / (2 * tp + fp + fn)
            IoU += tp / (tp + fp + fn)
        
        size = y_true.shape[0]
        
        result = {
            "precision": precision / size,
            "recall": recall / size,
            "accuracy": accuracy / size,
            "dice": dice / size,
            "IoU": IoU / size,
        }
        
        return result
    
    def visualize(self, dataset: tf.data.Dataset, image_num: int, random_seed: int) -> None:
        y_true = self.test_inference.get_cache_data()[1]
        size = y_true.shape[0]
        
        numpy_images = []
        for i, (img, _) in enumerate(dataset):
            numpy_images.append(img.numpy())
        numpy_images = np.asarray(numpy_images)
        indexes = np.linspace(0, size, size, dtype=int) 
        np.random.seed(random_seed)
        np.random.shuffle(indexes)
        indexes = indexes[:image_num]
        
        for i, ind in enumerate(indexes):
            img = numpy_images[ind]
            fig = plt.figure(figsize=(10, 100)) 
            fig.add_subplot(len(indexes), 2, 2 * i + 1)
            plt.imshow(img)
            fig.add_subplot(len(indexes), 2, 2 * i + 2)
            
            img_copy = np.copy(img)
            img_copy = cv2.rectangle(img_copy, (self.y_predicted[ind][0], self.y_predicted[ind][1]), 
                                     (self.y_predicted[ind][2], self.y_predicted[ind][3]), (0, 255, 0), 2)
            img_copy = cv2.rectangle(img_copy, (y_true[ind][0], y_true[ind][1]), (y_true[ind][2], y_true[ind][3]), (255, 0, 0), 2)
            
            plt.imshow(img_copy)
        
        
        