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
from OneClassClassificationTest import OneClassClassificationTest
from DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from TrainOneClassDataset import TrainOneClassDataset

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
test_pipeline = OneClassClassificationTest(file_handler)

#loading data to dataset instance
dataloader = AnimalsOneClassDataloader("../Data/Animals/animals", "lion")
dataset = TrainOneClassDataset(224, 224, 10, 42, dataloader, 300, 100, 0.3)
dataset.load()

#testing
test_pipeline.load()
y_prdicted = test_pipeline.process(dataset.get_test_data())
test_pipeline.visualize(y_prdicted)