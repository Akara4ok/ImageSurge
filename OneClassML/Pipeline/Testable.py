from abc import ABC, abstractmethod
import numpy as np
import tensorflow as tf

class Testable(ABC):
    """ Interface for test pipelines """
    
    @abstractmethod
    def test(self, dataset: tf.data.Dataset, use_cache: bool = False, **kwargs) -> np.ndarray:
        """ Process testing """
        pass

    @abstractmethod
    def get_metrics(self) -> None:
        """ Get metrics for pipeline """
        pass
    
    @abstractmethod
    def visualize(self) -> None:
        """ Visualize metrics for pipeline """
        pass