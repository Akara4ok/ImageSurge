import sys
import cv2
sys.path.append('Dataloader/')
from InferenceDataloader import InferenceDataloader
from CropDataloader import CropDataloader
from DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from DataloaderImpl.NaturalMultiClassDataloader import NaturalMultiClassDataloader
sys.path.append('Dataset/')
from InferenceDataset import InferenceDataset
from TrainOneClassDataset import TrainOneClassDataset
from TrainRefDataset import TrainRefDataset
from CropTestDataset import CropTestDataset

dataloader_crop = CropDataloader("../Data/Animals/animals", "cats-annotations.xml")
dataset = CropTestDataset(224, 224, dataloader_crop, 1)
dataset.load()
print(len(dataset.get_crop_data()))
for x_train, y_train in dataset.get_crop_data():
    cv2.imshow("image", x_train.numpy())
    print(y_train)
    if(cv2.waitKey(0) == ord('a')):
        shouldBreak = True
        break

# dataloader_one_class = AnimalsOneClassDataloader("../Data/Animals/animals", "", "lion")
# dataloader_ref = NaturalMultiClassDataloader("../Data/natural-images", "natural_images", "", False)
# dataset = TrainRefDataset(224, 224, 10, 1, dataloader_one_class, dataloader_ref, 300, 300, 0.3)
# dataset.load()
# print(len(dataset.get_train_data()))

# for batch in dataset.get_train_data():
#     shouldBreak = False
#     x_train, y_train = batch
#     for x, y in zip(x_train, y_train):
#         cv2.imshow("image", x.numpy())
#         if(cv2.waitKey(0) == ord('a')):
#             shouldBreak = True
#             break
#     print("batch")
#     if(shouldBreak):
#         break