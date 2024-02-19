from InferenceDataloader import InferenceDataloader
import sys
import tensorflow as tf
from Dataset import Dataset
sys.path.append("Dataloader/")


class InferenceDataset(Dataset):
    """ Implementation of dataset for user requests """

    def __init__(self, image_width: int, image_height: int, batch_size: int = None, dataloader: InferenceDataloader = None, random_seed: int = None):
        super().__init__(image_width, image_height, batch_size)
        self.dataloader = dataloader

    def load(self) -> None:
        """ Load data from dataloader to tf.Data """
        self.dataset = tf.data.Dataset.from_tensor_slices(self.dataloader.get_images_paths()).map(
            self.process_image, num_parallel_calls=tf.data.AUTOTUNE)
        if(self.batch_size):
            self.dataset = self.dataset.batch(self.batch_size)

    def get_data(self) -> tf.data.Dataset:
        """ Get tf.Dataset instance of dataloader  """
        return self.dataset