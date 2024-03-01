from utils.ExperimentInfo import ExperimentInfo
from Pipeline.utils.FileHandler import FileHandler
from Pipeline.OneClassClassificationTest import OneClassClassificationTest
from Pipeline.OneClassClassificationInference import OneClassClassificationInference
from Dataloader.DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from Dataset.TrainOneClassDataset import TrainOneClassDataset

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
pipeline = OneClassClassificationInference(file_handler)

#loading data to dataset instance
dataloader = AnimalsOneClassDataloader("../Data/Animals/animals", "lion")
dataset = TrainOneClassDataset(224, 224, 10, 42, dataloader, 300, 100, 0.3)

#testing
test_pipeline = OneClassClassificationTest(pipeline)
y_predicted = test_pipeline.test(dataset.get_test_data(), True)
test_pipeline.visualize()