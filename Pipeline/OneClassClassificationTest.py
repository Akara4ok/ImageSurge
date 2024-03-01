import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from sklearn.manifold import TSNE
from .Testable import Testable
from .OneClassClassificationInference import OneClassClassificationInference

class OneClassClassificationTest(Testable):
    """ Class for testing one class classification """
    
    def __init__(self, test_inference: OneClassClassificationInference) -> None:
        self.test_inference: OneClassClassificationInference = test_inference
        self.y_predicted: np.ndarray = None
        
    def test(self, dataset: tf.data.Dataset, use_cache: bool = False, **kwargs) -> np.ndarray:
        """ Testing inference """
        
        self.y_predicted = self.test_inference.process(dataset, use_cache, True, **kwargs)
        return self.y_predicted 
        
    def get_metrics(self) -> dict[str, float]:
        y_true = self.test_inference.get_cache_data()[1]
        return classification_report(y_true, self.y_predicted, output_dict=True)
    
    def visualize(self) -> None:
        cached_feauteres, y_true = self.test_inference.get_cache_data()
        print(classification_report(y_true, self.y_predicted))
        matrix = confusion_matrix(y_true, self.y_predicted)
        sns.heatmap(matrix, annot=True,fmt='2.0f')
        plt.show()
        
        emb = TSNE(n_components=2)
        x_prep = np.squeeze(cached_feauteres)
        class_features_tensor_emb = emb.fit_transform(x_prep)
        
        colors = np.empty((self.y_predicted.shape[0], 3))
        colors[(y_true == 0) & (y_true == self.y_predicted)] = mcolors.to_rgb("black")
        colors[(y_true == 1) & (y_true == self.y_predicted)] = mcolors.to_rgb("yellow")
        colors[(y_true == 0) & (y_true != self.y_predicted)] = mcolors.to_rgb("red")
        colors[(y_true == 1) & (y_true != self.y_predicted)] = mcolors.to_rgb("lightpink")
        
        plt.figure(figsize=(15,15))
        plt.scatter(class_features_tensor_emb[:, 0], class_features_tensor_emb[:, 1], c=colors)
        plt.show()