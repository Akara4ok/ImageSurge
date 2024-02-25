import numpy as np
from ModelHandler import ModelHandler

class PreTrainedModel(ModelHandler):
    """ Abstract class for pretrained models """
    
    def train(self) -> None:
        pass