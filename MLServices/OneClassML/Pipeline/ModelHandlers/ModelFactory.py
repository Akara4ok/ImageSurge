from .SimpleKerasModel import SimpleKerasModel, KerasModels
from .ClipModel import ClipModel
from .ImprovedResnet import ImprovedResnet
from .KServeModel import KServeModel
from .ModelHandler import ModelHandler

class ModelFactory:
    def create_model(model_name: str, kserve_path: str = "", token: str = None) -> ModelHandler:
        """ Create model by name """
        
        IMAGE_HEIGHT = 224
        IMAGE_WIDTH = 224
        MAX_ELEMENTS_TO_SEND = 1200
        
        if(kserve_path is not None):
            return KServeModel(kserve_path, token, MAX_ELEMENTS_TO_SEND)
        
        match model_name:
            case "VGG":
                return SimpleKerasModel(IMAGE_HEIGHT, IMAGE_WIDTH, KerasModels.VGG)
            case "Resnet":
                return SimpleKerasModel(IMAGE_HEIGHT, IMAGE_WIDTH, KerasModels.Resnet)
            case "Clip":
                return ClipModel()
            case "ImprovedResnet":
                return ImprovedResnet(IMAGE_HEIGHT, IMAGE_WIDTH)
            case _:
                raise Exception("Model type is undefined")