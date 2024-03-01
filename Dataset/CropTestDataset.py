import random
import tensorflow as tf
from .Dataset import Dataset
from Dataloader.CropDataloader import CropDataloader
from utils.functions import unzip_list

class CropTestDataset(Dataset):
    """ Implementation of dataset for user requests """

    def __init__(self, image_width: int, image_height: int, dataloader: CropDataloader, random_seed=None, test_image_count: int = None):
        super().__init__(image_width, image_height, random_seed=random_seed)
        self.dataloader = dataloader
        self.test_image_count = test_image_count
        self.dataset: tf.data.Dataset = None

    def process_cropped_info(self, path: str, info: tuple[int, int, int, int]):
        """ Function to map tf.data """
        return self.process_image(path), info

    def load(self) -> None:
        """ Load data from dataloader to tf.Data """

        test_images_list = self.dataloader.get_crop_test_images_path()
        if(not self.test_image_count):
            self.test_image_count = len(test_images_list)
        random.Random(self.random_seed).shuffle(test_images_list)
        test_images_list = test_images_list[:self.test_image_count]
        test_paths, test_info = unzip_list(test_images_list)

        self.dataset = tf.data.Dataset.from_tensor_slices((test_paths, test_info)).map(
            self.process_cropped_info, num_parallel_calls=tf.data.AUTOTUNE)
        
        self.is_loaded = True

    def get_crop_data(self) -> tf.data.Dataset:
        """ Get tf.Dataset instance of dataloader  """
        return self.dataset
