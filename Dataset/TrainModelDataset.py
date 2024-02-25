import sys
import tensorflow as tf
from TrainDataset import TrainDataset
sys.path.append("Dataloader/")
from OneClassDataloader import OneClassDataloader

class TrainModelDataset(TrainDataset):
    """ Implementation of dataset for additional model training """

    def __init__(self, image_width: int, image_height: int, batch_size: int = None, random_seed: int = None,
                 dataloader: OneClassDataloader = None, train_image_count: int = None,
                 test_image_count: int = None, target_image_percent: float = None
                 ):
        super().__init__(image_width, image_height, batch_size, random_seed, dataloader, train_image_count, test_image_count, target_image_percent)
        self.train_model_dataset: tf.data.Dataset = None

    def get_train_model_data(self) -> tf.data.Dataset:
        """ Get train tf.Dataset """
        return self.train_model_dataset