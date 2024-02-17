import sys
sys.path.append('Dataloader/')
from InferenceDataloader import InferenceDataloader
from DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from DataloaderImpl.NaturalMultiClassDataloader import NaturalMultiClassDataloader

dataloader = NaturalMultiClassDataloader("../Data/natural-images", "natural_images", "", False)
print(dataloader.get_train_images_paths())