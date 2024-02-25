import sys
sys.path.append("utils")
sys.path.append("Pipeline")
sys.path.append("Pipeline/ModelHandlers")
sys.path.append("Pipeline/utils")
from ExperimentInfo import ExperimentInfo
from utils.FileHandler import FileHandler, PipelineStage, ArtifactType
from ModelHandlers.SimpleKerasModel import SimpleKerasModel, KerasModels

experiment = ExperimentInfo("vlad", "test", "1")
file_handler = FileHandler("Artifacts/", experiment)

# modelHandler = SimpleKerasModel(224, 224, KerasModels.Resnet)
# modelHandler.train()
save_path = file_handler.get_file_path(PipelineStage.FeatureExtractor, ArtifactType.ModelHandler) 
model = FileHandler.loadModelHandler(save_path)
model.model.summary()