import random
import math
import tensorflow as tf
from .TrainModelDataset import TrainModelDataset
from Dataloader.OneClassDataloader import OneClassDataloader
from Dataloader.MultiClassDataloader import MultiClassDataloader
from utils.functions import unzip_list

class TrainRefDataset(TrainModelDataset):
    """ Implementation of dataset for one class classification with multiclass reference dataset"""

    def __init__(self, image_width: int, image_height: int, batch_size: int, random_seed: int = None,
                 one_class_dataloader: OneClassDataloader = None,  multi_class_dataloader: MultiClassDataloader = None,
                 train_image_count: int = None,
                 test_image_count: int = None, target_image_percent: float = None, min_ref_images: int = 0
                 ):
        super().__init__(image_width, image_height, batch_size, random_seed, one_class_dataloader, train_image_count, test_image_count, target_image_percent)
        self.multi_class_dataloader = multi_class_dataloader
        self.min_ref_images = min_ref_images

    def combine_ds(self, train_ref_path: list[str], train_ref_labels: list[int],  train_path: list[str], min_ref_images: int):
        """ Combine one class dataset and ref dataset """
        ds_size = min(len(train_ref_path), len(train_path))
        ref_ds_size = max(min(len(train_ref_path), ds_size), min_ref_images)
        koef = math.ceil(ref_ds_size / ds_size)
        train_ref_path = train_ref_path[:ref_ds_size]
        train_ref_labels = train_ref_labels[:ref_ds_size]
        train_path = train_path[:ds_size] * koef
        train_path = train_path[:ref_ds_size]
        
        train_ds = tf.data.Dataset.from_tensor_slices((train_path, train_ref_path, train_ref_labels)).map(
            self.process_multiple_images, num_parallel_calls=tf.data.AUTOTUNE).batch(self.batch_size)
        return train_ds

    def process_multiple_images(self, path1: str, path2: str, labels: int) -> tuple[tf.Tensor, tf.Tensor]:
        """ Function to map tf.data """
        return (self.process_image(path1), self.process_image(path2)), labels

    def process_train_path(self, path: str) -> tuple[tf.Tensor, int]:
        """ Function to map tf.data """
        return self.process_image(path), -1

    def load(self) -> None:
        train_images_list = self.one_class_dataloader.get_train_images_paths()
        if(not self.train_image_count):
            self.train_image_count = len(train_images_list)
        random.Random(self.random_seed).shuffle(train_images_list)
        train_images_list = train_images_list[:self.train_image_count]
        train_paths, _ = unzip_list(train_images_list)
        self.train_dataset = tf.data.Dataset.from_tensor_slices(train_paths).map(
            self.process_train_path, num_parallel_calls=tf.data.AUTOTUNE)
        if(self.batch_size):
            self.train_dataset = self.train_dataset.batch(self.batch_size)
            
        
        train_ref_images_list = self.multi_class_dataloader.get_train_images_paths()
        random.Random(self.random_seed).shuffle(train_ref_images_list)
        train_ref_paths, train_ref_labels = unzip_list(train_ref_images_list)
        
        self.train_model_dataset = self.combine_ds(train_ref_paths, train_ref_labels, train_paths, self.min_ref_images)
        
        all_test_images = self.one_class_dataloader.get_test_images_paths()
        if(len(all_test_images) != 0):
            if(not self.test_image_count):
                self.test_image_count = len(all_test_images)
            test_images_not_target = list(filter(lambda x: x[1] == 0, all_test_images))
            random.Random(self.random_seed).shuffle(test_images_not_target)
            test_images_target = list(filter(lambda x: x[1] == 1, all_test_images))
            random.Random(self.random_seed).shuffle(test_images_target)    
            len_non_target = int(len(test_images_target) * (1 - self.target_image_percent) / self.target_image_percent)
            test_images_not_target = test_images_not_target[:len_non_target]
            test_images_list = test_images_target + test_images_not_target
            test_paths, test_labels = unzip_list(test_images_list)
            
            self.test_dataset = tf.data.Dataset.from_tensor_slices((test_paths, test_labels)).map(
                self.process_path, num_parallel_calls=tf.data.AUTOTUNE)
            if(self.batch_size):
                self.test_dataset = self.test_dataset.batch(self.batch_size)
        
        self.is_loaded = True
    
    def get_labels_count(self):
        return self.multi_class_dataloader.get_labels_count()