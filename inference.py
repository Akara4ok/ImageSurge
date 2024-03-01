from utils.ExperimentInfo import ExperimentInfo
from Pipeline.utils.FileHandler import FileHandler
from Pipeline.OneClassClassificationInference import OneClassClassificationInference
from Dataloader.InferenceDataloader import InferenceDataloader
from Dataset.InferenceDataset import InferenceDataset

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
inference_pipeline = OneClassClassificationInference(file_handler)

#loading data to dataset instance
dataloader = InferenceDataloader("../Data/Animals/animals/inf")
dataset = InferenceDataset(224, 224, 10, dataloader)

#inference
print(inference_pipeline.process(dataset.get_data()))