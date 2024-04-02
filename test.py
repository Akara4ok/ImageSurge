import sys
sys.path.append("OneClassML")
import os
from utils.functions import get_access_token
from Pipeline.ModelHandlers.KServeModel import KServeModel
from utils.ExperimentInfo import ExperimentInfo
from Pipeline.utils.FileHandler import FileHandler
from Pipeline.OneClassClassificationTest import OneClassClassificationTest
from Pipeline.OneClassClassificationInference import OneClassClassificationInference
from Dataloader.DataloaderImpl.AnimalsOneClassDataloader import AnimalsOneClassDataloader
from Dataset.TrainOneClassDataset import TrainOneClassDataset
import tensorflow as tf

gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

experiment = ExperimentInfo("1", "1", "1")
file_handler = FileHandler("Artifacts/", experiment)
# kserve_model = KServeModel("http://localhost:8080/v1/models/resnet50:predict", None, 1200)
# kserve_model = KServeModel(os.getenv("CLOUD_HOST")+"/v1/models/resnet50:predict", get_access_token(), 1200)
pipeline = OneClassClassificationInference(file_handler)

#loading data to dataset instance
dataloader = AnimalsOneClassDataloader("../Data/Animals/animals", "lion")
dataset = TrainOneClassDataset(224, 224, 10, 42, dataloader, 300, 100, 0.3)

#testing
test_pipeline = OneClassClassificationTest(pipeline)
y_predicted = test_pipeline.test(dataset.get_test_data(), True)
test_pipeline.visualize()