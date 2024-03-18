""" Possible used loss function for training with reference dataset """
import tensorflow as tf
from keras import backend as K

class OneClassLoss(tf.losses.Loss):
    """ Custom loss for one class batches """
    def __init__(self, alpha: float):
        super(OneClassLoss, self).__init__()
        self.alpha = alpha
        
    def call(self, y_true, y_pred):
        average_vector = tf.reduce_mean(y_pred, axis=0)
        distances = tf.norm(y_pred - average_vector, axis=1)
        loss = K.mean(distances)
        return loss * self.alpha