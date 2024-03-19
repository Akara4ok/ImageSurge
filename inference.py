import sys
sys.path.append("OneClassML")
from utils.ExperimentInfo import ExperimentInfo
from Pipeline.utils.FileHandler import FileHandler
from Pipeline.OneClassClassificationInference import OneClassClassificationInference
from Dataloader.InferenceDataloader import InferenceDataloader
from Dataset.InferenceDataset import InferenceDataset
from Pipeline.ModelHandlers.KServeModel import KServeModel

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)
kserve_model = KServeModel("http://localhost:8080/v1/models/resnet50:predict", 1200)
inference_pipeline = OneClassClassificationInference(file_handler, kserve_model)

#loading data to dataset instance
dataloader = InferenceDataloader("../Data/Animals/animals/inf")
dataset = InferenceDataset(224, 224, 10, dataloader)

#inference
print(inference_pipeline.process(dataset.get_data()))
# , "http://localhost:8080/v1/models/resnet50:predict"