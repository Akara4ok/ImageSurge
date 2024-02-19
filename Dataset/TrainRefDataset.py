import sys
import random
import tensorflow as tf
from TrainDataset import TrainDataset
sys.path.append("Dataloader/")
from OneClassDataloader import OneClassDataloader
from MultiClassDataloader import MultiClassDataloader


class TrainRefDataset(TrainDataset):
    """ Implementation of dataset for one class classification with multiclass reference dataset"""

    def __init__(self, image_width: int, image_height: int, batch_size: int, random_seed: int = None,
                 one_class_dataloader: OneClassDataloader = None,  multi_class_dataloader: MultiClassDataloader = None,
                 train_image_count: int = None,
                 test_image_count: int = None, target_image_percent: float = None
                 ):
        super().__init__(image_width, image_height, batch_size, random_seed, one_class_dataloader, train_image_count, test_image_count, target_image_percent)
        self.multi_class_dataloader = multi_class_dataloader
        self.train_one_dataset: tf.data.Dataset = None

    def combine_ds(self, train_ds_ref: tf.data.Dataset, train_ds: tf.data.Dataset):
        """ Combine one class dataset and ref dataset """
        ds_size = min(len(train_ds), len(train_ds_ref))
        train_ds_ref = train_ds_ref.take(ds_size)
        train_ds = train_ds.take(ds_size)
        return train_ds_ref.concatenate(train_ds).shuffle(2 * ds_size)

    def process_train_path(self, path: str) -> tuple[tf.Tensor, int]:
        """ Function to map tf.data """
        return self.process_image(path), -1

    def load(self) -> None:
        train_images_list = self.one_class_dataloader.get_train_images_paths()
        random.Random(self.random_seed).shuffle(train_images_list)
        train_images_list = train_images_list[:self.train_image_count]
        train_paths, _ = self.unzip_list(train_images_list)
        self.train_one_dataset = tf.data.Dataset.from_tensor_slices(train_paths).map(
            self.process_train_path, num_parallel_calls=tf.data.AUTOTUNE)
        if(self.batch_size):
            self.train_one_dataset = self.train_one_dataset.batch(self.batch_size)
            
        
        train_ref_images_list = self.multi_class_dataloader.get_train_images_paths()
        random.Random(self.random_seed).shuffle(train_ref_images_list)
        train_ref_images_list = train_ref_images_list[:self.train_image_count]
        train_ref_paths, train_ref_labels = self.unzip_list(train_ref_images_list)
        train_ref_dataset = tf.data.Dataset.from_tensor_slices((train_ref_paths, train_ref_labels)).map(
            self.process_path, num_parallel_calls=tf.data.AUTOTUNE)
        if(self.batch_size):
            train_ref_dataset = train_ref_dataset.batch(self.batch_size)
        
        self.train_dataset = self.combine_ds(self.train_one_dataset, train_ref_dataset)
        
        all_test_images = self.one_class_dataloader.get_test_images_paths()
        test_images_not_target = list(filter(lambda x: x[1] == 0, all_test_images))
        random.Random(self.random_seed).shuffle(test_images_not_target)
        test_images_target = list(filter(lambda x: x[1] == 1, all_test_images))
        random.Random(self.random_seed).shuffle(test_images_target)    
        test_images_target = test_images_target[:int(self.target_image_percent * self.test_image_count)]
        test_images_not_target = test_images_not_target[:int((1 - self.target_image_percent) * self.test_image_count)]
        test_images_list = test_images_target + test_images_not_target
        test_paths, test_labels = self.unzip_list(test_images_list)
        
        self.test_dataset = tf.data.Dataset.from_tensor_slices((test_paths, test_labels)).map(
            self.process_path, num_parallel_calls=tf.data.AUTOTUNE)
        if(self.batch_size):
            self.test_dataset = self.test_dataset.batch(self.batch_size)
            
    def get_one_class_train(self) -> tf.data.Dataset:
        """ train one dataset """
        return self.train_one_dataset