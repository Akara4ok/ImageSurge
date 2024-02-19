import sys
import cv2
sys.path.append('Dataloader/')
from InferenceDataloader import InferenceDataloader
from DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from DataloaderImpl.NaturalMultiClassDataloader import NaturalMultiClassDataloader
sys.path.append('Dataset/')
from InferenceDataset import InferenceDataset
from TrainOneClassDataset import TrainOneClassDataset

dataloader = AnimalsOneClassDataloader("../Data/Animals/animals", "", "lion")
dataset = TrainOneClassDataset(224, 224, 10, 1, dataloader, 300, 300, 30)
dataset.load()
print(len(dataset.get_train_data()))

for batch in dataset.get_train_data():
    shouldBreak = False
    x_train, y_train = batch
    for x, y in zip(x_train, y_train):
        cv2.imshow("image", x.numpy())
        if(cv2.waitKey(0) == ord('a')):
            shouldBreak = True
            break
    print("batch")
    if(shouldBreak):
        break