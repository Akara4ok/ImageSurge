import json
from .SimpleKerasModel import SimpleKerasModel, KerasModels
from .ClipModel import ClipModel
from .ImprovedResnet import ImprovedResnet
from .ModelHandler import ModelHandler, Models
from .KServeModel import KServeModel

class ModelLoader:
    def load(load_path: str) -> ModelHandler:
        """ Load model from file """
        load_path += "_metainfo.json"
        file = open(load_path)
        data = json.load(file)
        model_type = Models(data["class"])
        modelHandler: ModelHandler = None
        match model_type:
            case Models.SimpleKeras:
                modelHandler = SimpleKerasModel(data["image_width"], data["image_height"], KerasModels(data["model_type"]))
                modelHandler.load()
            case Models.Clip:
                modelHandler = ClipModel()
                modelHandler.load()
            case Models.ImprovedResnet:
                modelHandler = ImprovedResnet(data["image_width"], data["image_height"])
                modelHandler.load(data["model_path"])
            case _:
                raise Exception("Model type is undefined")
        
        return modelHandler