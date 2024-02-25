import numpy as np
from ModelHandler import ModelHandler
import sys
sys.path.append("Dataset")
from TrainModelDataset import TrainModelDataset

class PreTrainedModel(ModelHandler):
    """ Abstract class for pretrained models """
    
    def train(self, dataset: TrainModelDataset = None, epochs: int = None) -> None:
        self.load()