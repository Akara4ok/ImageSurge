import tensorflow as tf
from keras import Model
from keras.applications import ResNet50
from keras.layers import Dense, Input

def ResnetTrainingModel(input_size: tuple[int, int, int], output_size: int) -> Model: 
    input_layer = Input(shape=input_size)
    
    feauteres = ResNet50(input_shape=input_size, weights='imagenet', include_top=False, pooling='avg')(input_layer)
    clasification = Dense(output_size, activation='softmax', name = "resnet_ref_dense")(feauteres)
    model = Model(input_layer, [clasification, feauteres])
    
    return model