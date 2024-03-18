from abc import ABC, abstractmethod
import numpy as np

class SklearnInterface(ABC):
    """ Base interface for sklearn classes(used for type hint in major) """
    
    @abstractmethod
    def fit(self, X: np.ndarray, y: np.ndarray = None) -> None:
        pass
    
    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        pass
    
    @abstractmethod
    def transform(self, X: np.ndarray) -> np.ndarray:
        pass
    
    @abstractmethod
    def fit_transform(self, X: np.ndarray, y: np.ndarray = None) -> np.ndarray:
        pass