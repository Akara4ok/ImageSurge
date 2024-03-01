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
from OneClassClassificationInference import OneClassClassificationInference
from InferenceDataloader import InferenceDataloader
from InferenceDataset import InferenceDataset

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
inference_pipeline = OneClassClassificationInference(file_handler)

#loading data to dataset instance
dataloader = InferenceDataloader("../Data/Animals/animals/inf")
dataset = InferenceDataset(224, 224, 10, dataloader)

#inference
print(inference_pipeline.process(dataset.get_data()))