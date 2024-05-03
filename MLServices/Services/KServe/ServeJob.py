import sys
sys.path.append("OneClassML")

from kserve import ModelServer
from KServeModelHandler import KServeModelHandler
from KServeCrop import KServeCrop
import tensorflow as tf

KSERVE_BATCH = 32

class ServeJob:
    """ Class for serving all kserve models """
    
    def __init__(self, port: int) -> None:
        self.port = port
        
    def serve(self, names: list[str], paths: list[str]) -> None:
        if(len(names) != len(paths)):
            raise Exception("names and paths length dismatch")

        model_list: list[KServeModelHandler] = []
        for i in range(len(names)):
            model_list.append(KServeModelHandler(names[i], paths[i], KSERVE_BATCH))
        
        model_list.append(KServeCrop("crop"))
        ModelServer(enable_docs_url=True, http_port=8080).start(model_list)
        
        
if __name__ == "__main__":
    serve_job = ServeJob(port = 8080)
    serve_job.serve(["resnet50", "clip"], ["OneClassML/DefaultModels/resnet", "OneClassML/DefaultModels/clip"])