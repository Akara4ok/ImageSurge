from abc import ABC, abstractmethod
import tensorflow as tf

class Dataset(ABC):
    """ Abstract class for dataset """
    
    def __init__(self, image_width: int, image_height: int, batch_size: int = None, random_seed: int = None):
        self.image_width = image_width
        self.image_height = image_height
        self.batch_size = batch_size
        self.random_seed = random_seed
    
    @abstractmethod
    def load(self) -> None:
        """ Load data from dataloader to tf.Data """
        pass
    
    def process_image(self, file_path: str) -> tf.Tensor:
        """ Load and base preprocess image """
        img = tf.io.read_file(file_path)
        img = tf.io.decode_jpeg(img, channels=3)
        img = tf.reverse(img, axis=[-1])
        img = tf.image.resize(img, [self.image_height, self.image_width])
        return tf.cast(img, tf.uint8)