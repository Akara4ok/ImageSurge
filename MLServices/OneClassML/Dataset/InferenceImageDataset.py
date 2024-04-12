import tensorflow as tf
from .Dataset import Dataset
import numpy as np

class InferenceImageDataset(Dataset):
    """ Implementation of dataset for user requests """

    def __init__(self, image_width: int, image_height: int, batch_size: int = None):
        super().__init__(image_width, image_height, batch_size)
        self.dataset: tf.data.Dataset = None

    def process_ready_image(self, image: tf.Tensor) -> tf.Tensor:
        """ Load and base preprocess image """
        img = tf.image.resize(image, [self.image_height, self.image_width])
        return tf.cast(img, tf.uint8)

    def load(self, images: list[np.ndarray]) -> None:
        """ Load data from dataloader to tf.Data """
        self.dataset = tf.data.Dataset.from_tensor_slices(images).map(
            self.process_ready_image, num_parallel_calls=tf.data.AUTOTUNE)
            
        self.is_loaded = True

    def get_data(self) -> tf.data.Dataset:
        """ Get tf.Dataset instance of dataloader  """
        return self.dataset