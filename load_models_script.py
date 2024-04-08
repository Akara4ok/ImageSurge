from keras.applications import ResNet50
from keras.applications import VGG16
from transformers import TFCLIPModel, AutoProcessor

model = VGG16(input_shape=(224, 224, 3), weights='imagenet', include_top=False, pooling='avg')
model = ResNet50(input_shape=(224, 224, 3), weights='imagenet', include_top=True, pooling='avg')
model = ResNet50(input_shape=(224, 224, 3), weights='imagenet', include_top=False, pooling='avg')
model = TFCLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = AutoProcessor.from_pretrained("openai/clip-vit-base-patch32")