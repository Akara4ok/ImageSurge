import sys
sys.path.append("utils")
sys.path.append("Pipeline")
sys.path.append("Pipeline/ModelHandlers")
sys.path.append("Pipeline/utils")
sys.path.append('Dataloader/')
sys.path.append('Dataset/')
from ExperimentInfo import ExperimentInfo
from utils.FileHandler import FileHandler
from ModelHandlers.SimpleKerasModel import SimpleKerasModel, KerasModels
from OneClassClassificationTrain import OneClassClassificationTrain
from sklearn import svm
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from TrainOneClassDataset import TrainOneClassDataset

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
train_pipeline = OneClassClassificationTrain(file_handler)

#configure
model = SimpleKerasModel(224, 224, KerasModels.Resnet)
oc_svm_clf = svm.OneClassSVM(gamma=0.001, kernel='rbf', nu=0.08)
ss = StandardScaler()
pca = PCA(n_components=128, whiten=True)

#loading data to dataset instance
dataloader_one_class = AnimalsOneClassDataloader("../Data/Animals/animals", "lion")
dataset = TrainOneClassDataset(224, 224, 10, 42, dataloader_one_class, 300, 600, 0.3)
dataset.load()

#training pipeline
train_pipeline.configure(model, oc_svm_clf)
train_pipeline.train(dataset)
train_pipeline.save()