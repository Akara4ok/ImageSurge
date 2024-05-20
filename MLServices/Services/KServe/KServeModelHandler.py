import tensorflow as tf
from typing import Dict, Union
from PIL import Image
import base64
import io
import numpy as np
import cv2
from datetime import datetime

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

DEVICE = "cuda" if len(tf.config.list_physical_devices('GPU')) > 0 else "cpu"

class KServeModelHandler(Model):
    """ Class to serve Model Handlers with kserve """
    def __init__(self, name: str, path: str, batch: int = None) -> None:
        super().__init__(name)
        self.name = name
        self.model_handler: ModelHandler = None 
        self.batch = batch
        self.path = path
        self.model = None
        self.ready = False
        self.load()

    def load(self) -> bool:
        # load model
        self.model_handler = ModelLoader.load(self.path)
        self.model = self.model_handler.model
        self.ready = True
        return self.ready
    
    def preprocess(
        self, payload: Union[Dict, InferRequest], headers: Dict[str, str] = None
    ) -> tf.Tensor:
        result_tensor = []
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        
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

        result_tensor = np.asarray(result_tensor)
        result_tensor = self.model_handler.preprocess(result_tensor)
        return result_tensor

    def predict(
        self, input_tensor: tf.Tensor, headers: Dict[str, str] = None
    ) -> Union[Dict, InferResponse]:
        
        result_data = input_tensor
        output = None
        if(self.batch is not None):
            result_data = tf.data.Dataset.from_tensor_slices(input_tensor)
            result_data = result_data.batch(self.batch)
            for batch in result_data:
                result = self.model_handler.extract_features(batch)
                if(not isinstance(result, np.ndarray)):
                    result = result.numpy()
                if(output is None):
                    output = result
                else:
                    output = np.concatenate((output, result))
        else:
            output = self.model_handler.extract_features(result_data)
            
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
                "features": result_pred,
                "device": DEVICE,
            }
        else:
            return infer_response