from keras import Model
from keras.applications import ResNet50
from keras.layers import Dense, Input, Layer

def ResnetTrainingModel(input_size: tuple[int, int, int], output_size: int) -> Model: 
    input_layer_1 = Input(shape=input_size)
    input_layer_2 = Input(shape=input_size)
    
    feature_extractor = ResNet50(input_shape=input_size, weights='imagenet', include_top=False, pooling='avg')
    feauteres_one_class = feature_extractor(input_layer_1)
    feauteres_one = Layer(name="one_class")(feauteres_one_class)
    feauteres_multi_class = feature_extractor(input_layer_2)
    clasification = Dense(output_size, activation='softmax', name = "resnet_ref_dense")(feauteres_multi_class)
    model = Model(inputs = [input_layer_1, input_layer_2], outputs = [clasification, feauteres_one])
    
    return model