from sklearn import svm
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import sys
import os
sys.path.append("OneClassML")
from Pipeline.ModelHandlers.KServeModel import KServeModel
from utils.ExperimentInfo import ExperimentInfo
from Pipeline.utils.FileHandler import FileHandler
from Pipeline.ModelHandlers.SimpleKerasModel import SimpleKerasModel, KerasModels
from Pipeline.OneClassClassificationTrain import OneClassClassificationTrain
from Dataloader.DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from Dataset.TrainOneClassDataset import TrainOneClassDataset

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
train_pipeline = OneClassClassificationTrain(file_handler)

#configure
# model = SimpleKerasModel(224, 224, KerasModels.Resnet)
# model = KServeModel("http://localhost:8080/v1/models/resnet50:predict", None, 1200)
model = KServeModel(os.getenv("CLOUD_HIST")+"/v1/models/clip:predict", None, 1200)
oc_svm_clf = svm.OneClassSVM(gamma=0.001, kernel='rbf', nu=0.08)
ss = StandardScaler()
pca = PCA(n_components=128, whiten=True)

#loading data to dataset instance
dataloader_one_class = AnimalsOneClassDataloader("../Data/Animals/animals", "lion")
dataset = TrainOneClassDataset(224, 224, 10, 42, dataloader_one_class, target_image_percent=0.3)

#training pipeline
train_pipeline.configure(model, oc_svm_clf)
train_pipeline.train(dataset, use_cache=True, save_cache=True)
train_pipeline.save()