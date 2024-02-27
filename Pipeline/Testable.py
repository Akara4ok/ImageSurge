from abc import ABC, abstractmethod

class Testable(ABC):
    """ Interface for test pipelines """
    
    @abstractmethod
    def get_metrics(self) -> None:
        """ Get metrics for pipeline """
        pass
    
    @abstractmethod
    def viualize(self) -> None:
        """ Visualize metrics for pipeline """
        pass