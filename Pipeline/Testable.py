from abc import ABC, abstractmethod
import numpy as np

class Testable(ABC):
    """ Interface for test pipelines """
    
    @abstractmethod
    def get_metrics(self, y_predicted: np.ndarray) -> None:
        """ Get metrics for pipeline """
        pass
    
    @abstractmethod
    def viualize(self, y_predicted: np.ndarray) -> None:
        """ Visualize metrics for pipeline """
        pass