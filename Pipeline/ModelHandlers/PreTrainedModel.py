from .ModelHandler import ModelHandler
from Dataset.TrainModelDataset import TrainModelDataset

class PreTrainedModel(ModelHandler):
    """ Abstract class for pretrained models """
    
    def train(self, dataset: TrainModelDataset = None, epochs: int = None) -> None:
        self.load()