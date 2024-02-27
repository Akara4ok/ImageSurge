import sys
import tensorflow as tf
from Dataset import Dataset
import logging
sys.path.append("Dataloader/")
from OneClassDataloader import OneClassDataloader

class TrainDataset(Dataset):
    """ Implementation of dataset for training and testing """

    def __init__(self, image_width: int, image_height: int, batch_size: int = None, random_seed: int = None,
                 dataloader: OneClassDataloader = None, train_image_count: int = None,
                 test_image_count: int = None, target_image_percent: float = None
                 ):
        super().__init__(image_width, image_height, batch_size, random_seed)
        self.one_class_dataloader = dataloader
        self.train_image_count = train_image_count
        self.test_image_count = test_image_count
        self.target_image_percent = target_image_percent
        self.train_dataset: tf.data.Dataset = None
        self.test_dataset: tf.data.Dataset = None

    def get_train_data(self) -> tf.data.Dataset:
        """ Get train tf.Dataset """
        if(self.train_dataset == None):
            logging.warning("Dataset is not loaded. Call 'load' function")
        return self.train_dataset

    def get_test_data(self) -> tf.data.Dataset:
        """ Get test tf.Dataset """
        if(self.train_dataset == None):
            logging.warning("Dataset is not loaded. Call 'load' function")
        return self.test_dataset
    
    def process_path(self, path: str, label: int) -> tuple[tf.Tensor, int]:
        """ Function to map tf.data """
        return self.process_image(path), label