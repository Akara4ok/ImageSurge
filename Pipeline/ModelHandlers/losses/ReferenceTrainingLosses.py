""" Possible used loss function for training with reference dataset """
import tensorflow as tf
from keras import backend as K

scce = tf.keras.losses.SparseCategoricalCrossentropy()

def one_class_loss(y_true: tf.Tensor, y_pred: tf.Tensor) -> tf.Tensor:
    if(K.any(K.less(y_true, 0))):
        average_vector = tf.reduce_mean(y_pred, axis=0)
        distances = tf.norm(y_pred - average_vector, axis=1)
        loss = K.mean(distances)
    else:
        loss = 0.0
    return loss

def multi_class_loss(y_true: tf.Tensor, y_pred: tf.Tensor) -> tf.Tensor:
    if(K.any(K.less(y_true, 0))):
        loss = 0.0
    else:
        loss = scce(y_true, y_pred) 
    return loss