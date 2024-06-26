import random
import tensorflow as tf
from Dataset.TrainDataset import TrainDataset
from Dataloader.OneClassDataloader import OneClassDataloader
from utils.functions import unzip_list

class TrainOneClassDataset(TrainDataset):
    """ Implementation of dataset for simple one class classification """

    def __init__(self, image_width: int, image_height: int, batch_size: int = None, random_seed: int = None,
                 dataloader: OneClassDataloader = None, train_image_count: int = None,
                 test_image_count: int = None, target_image_percent: float = None
                 ):
        super().__init__(image_width, image_height, batch_size, random_seed, dataloader, train_image_count, 
                         test_image_count, target_image_percent)

    def load(self) -> None:
        train_images_list = self.one_class_dataloader.get_train_images_paths()
        random.Random(self.random_seed).shuffle(train_images_list)
        if(not self.train_image_count):
            self.train_image_count = len(train_images_list)
        train_images_list = train_images_list[:self.train_image_count]
        train_paths, train_labels = unzip_list(train_images_list)
        self.train_dataset = tf.data.Dataset.from_tensor_slices((train_paths, train_labels)).map(
            self.process_path, num_parallel_calls=tf.data.AUTOTUNE)
        if(self.batch_size):
            self.train_dataset = self.train_dataset.batch(self.batch_size)
        
        all_test_images = self.one_class_dataloader.get_test_images_paths()
        if(len(all_test_images) != 0):
            if(not self.test_image_count):
                self.test_image_count = len(all_test_images)
            test_images_not_target = list(filter(lambda x: x[1] == 0, all_test_images))
            test_images_target = list(filter(lambda x: x[1] == 1, all_test_images))
            len_non_target = int(len(test_images_target) * (1 - self.target_image_percent) / self.target_image_percent)
            test_images_not_target = test_images_not_target[:len_non_target]
            test_images_list = test_images_target + test_images_not_target
            random.Random(self.random_seed).shuffle(test_images_list)
            test_paths, test_labels = unzip_list(test_images_list)
            
            self.test_dataset = tf.data.Dataset.from_tensor_slices((test_paths, test_labels)).map(
                self.process_path, num_parallel_calls=tf.data.AUTOTUNE)
            if(self.batch_size):
                self.test_dataset = self.test_dataset.batch(self.batch_size)
        
        self.is_loaded = True