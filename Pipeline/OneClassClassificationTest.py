import numpy as np
from utils.FileHandler import FileHandler
from OneClassClassificationInference import OneClassClassificationInference
from sklearn.metrics import classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from sklearn.manifold import TSNE

class OneClassClassificationTest(OneClassClassificationInference):
    """ Class for testing one class classification """
    
    def __init__(self, file_handler: FileHandler) -> None:
        super().__init__(file_handler)
        self.is_train = True
        
    def get_metrics(self, y_predicted: np.ndarray) -> dict[str, float]:
        y_predicted = np.copy(y_predicted)
        y_predicted[y_predicted == -1] = 0
        return classification_report(self.y_true, y_predicted, output_dict=True)
        
    
    def visualize(self, y_predicted: np.ndarray) -> None:
        y_predicted = np.copy(y_predicted)
        y_predicted[y_predicted == -1] = 0
        print(classification_report(self.y_true, y_predicted))
        matrix = confusion_matrix(self.y_true, y_predicted)
        sns.heatmap(matrix, annot=True,fmt='2.0f')
        plt.show()
        
        emb = TSNE(n_components=2)
        x_prep = np.squeeze(self.cached_feauteres)
        class_features_tensor_emb = emb.fit_transform(x_prep)
        
        colors = np.empty((y_predicted.shape[0], 3))
        colors[(self.y_true == 0) & (self.y_true == y_predicted)] = mcolors.to_rgb("black")
        colors[(self.y_true == 1) & (self.y_true == y_predicted)] = mcolors.to_rgb("yellow")
        colors[(self.y_true == 0) & (self.y_true != y_predicted)] = mcolors.to_rgb("red")
        colors[(self.y_true == 1) & (self.y_true != y_predicted)] = mcolors.to_rgb("lightpink")
        
        plt.figure(figsize=(15,15))
        plt.scatter(class_features_tensor_emb[:, 0], class_features_tensor_emb[:, 1], c=colors)
        plt.show()