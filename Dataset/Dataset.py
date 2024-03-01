from abc import ABC, abstractmethod
import tensorflow as tf
from typing import Callable

class Dataset(ABC):
    """ Abstract class for dataset """
    
    def __init__(self, image_width: int, image_height: int, batch_size: int = None, random_seed: int = None):
        self.image_width = image_width
        self.image_height = image_height
        self.batch_size = batch_size
        self.random_seed = random_seed
        self.is_loaded: bool = False
    
    def need_load(func: Callable) -> Callable:
        """ check is data loaded """
        def load_decorator(self):
            if(not self.is_loaded):
                self.load(self)
            return func(self)
        return load_decorator
    
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
    
    def unzip_list(self, cur_list: list[tuple[str, int]]) -> tuple[list[str], list[int]]:
        """ Unzip list of tuples """
        
        list_unzipped = [list(t) for t in zip(*cur_list)]
        return list_unzipped[0], list_unzipped[1]