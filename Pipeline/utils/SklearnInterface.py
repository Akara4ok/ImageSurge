from abc import ABC, abstractmethod
import numpy as np

class SklearnInterface(ABC):
    """ Base interface for sklearn classes(used for type hint in major) """
    
    @abstractmethod
    def fit(self, X, y = None) -> None:
        pass
    
    @abstractmethod
    def predict(self, X) -> np.ndarray:
        pass
    
    @abstractmethod
    def transform(self, X) -> np.ndarray:
        pass
    
    @abstractmethod
    def fit_transform(self, X, y = None) -> None:
        pass