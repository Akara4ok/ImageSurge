import tensorflow as tf
from typing import Dict, Union
from PIL import Image
import base64
import io
import numpy as np
import cv2
import sys
sys.path.append("OneClassML")

from kserve import (
    Model,
    InferRequest,
    InferOutput,
    InferResponse,
)

from kserve.errors import InvalidInput
from kserve.utils.utils import generate_uuid
from Pipeline.ModelHandlers.ModelHandler import ModelHandler
from Pipeline.ModelHandlers.ModelLoader import ModelLoader
from Pipeline.CropInference import CropInference
from kserve import ModelServer

DEVICE = "cuda" if len(tf.config.list_physical_devices('GPU')) > 0 else "cpu"

class KServeCrop(Model):
    """ Class to serve Model Handlers with kserve """
    def __init__(self, name: str) -> None:
        super().__init__(name)
        self.name = name
        self.model_handler: ModelHandler = None 
        self.path = "OneClassML/DefaultModels/resnet"
        self.ready = False
        self.load()

    def load(self) -> bool:
        # load model
        self.model_handler = ModelLoader.load(self.path)
        self.ready = True
        return self.ready
    
    def preprocess(
        self, payload: Union[Dict, InferRequest], headers: Dict[str, str] = None
    ) -> tf.Tensor:
        result_tensor = []
        
        if isinstance(payload, Dict) and "instances" in payload:
            headers["request-type"] = "v1"
            for instance in payload["instances"]:
                if "data" in instance:
                    np_array = cv2.imdecode(np.asarray(bytearray(instance["data"]), dtype="uint8") , cv2.IMREAD_COLOR)
                    result_tensor.append(np_array)
                elif "image" in instance:
                    # decode image from base64 back to bytes
                    img_data = instance["image"]["b64"]
                    raw_img_data = base64.b64decode(img_data)
                    input_image = Image.open(io.BytesIO(raw_img_data))
                    result_tensor.append(input_image)
        else:
            raise InvalidInput("invalid payload")

        result_tensor = {
            "data": np.asarray(result_tensor),
            "result_classification": payload["result_classification"],
            "level": payload["level"],
            "save_cache": payload["save_cache"],
            "cluster_center": payload["cluster_center"]
            }
        if("similarity" in payload):
            result_tensor["similarity"] = payload["similarity"]
        return result_tensor

    def predict(
        self, input_tensor: dict, headers: Dict[str, str] = None
    ) -> Union[Dict, InferResponse]:
        self.inference = CropInference(None, kserve_model=self.model_handler)
        self.inference.feature_extractor = self.model_handler
        self.inference.cluster_center = input_tensor["cluster_center"]
        self.inference.is_loaded = True
        input_data = tf.data.Dataset.from_tensor_slices(input_tensor["data"])
        similarity = None
        if("similarity" in input_tensor):
            similarity = input_tensor["similarity"]
        output = self.inference.process(input_data, result_classification = input_tensor["result_classification"], 
                                                 level = input_tensor["level"], similarity = similarity)
        result_pred = output.tolist()
        response_id = generate_uuid()
        infer_output = InferOutput(
            name="output-0", shape=list(output.shape), datatype="FP32", data=result_pred
        )
        infer_response = InferResponse(
            model_name=self.name, infer_outputs=[infer_output], response_id=response_id
        )

        if "request-type" in headers and headers["request-type"] == "v1":
            return {
                "result_crop": result_pred,
                "similarity": self.inference.get_calc_similarity(),
                "device": DEVICE,
            }
        else:
            return infer_response
    
if __name__ == "__main__":
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if (len(gpus) > 0):
        try:
            tf.config.experimental.set_virtual_device_configuration(gpus[0], 
                                                                    [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=10000)])
        except RuntimeError as e:
            print(e)
    model = KServeCrop("resnet50")
    ModelServer(enable_docs_url=True, http_port=8080).start([model])