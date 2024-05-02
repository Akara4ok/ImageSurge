import sys
sys.path.append("OneClassML")

from kserve import ModelServer
from KServeModelHandler import KServeModelHandler
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
        
        ModelServer(enable_docs_url=True, http_port=8080).start(model_list)
        
        
if __name__ == "__main__":
    gpus = tf.config.experimental.list_physical_devices('GPU')
    if (len(gpus) > 0):
        try:
            tf.config.experimental.set_virtual_device_configuration(gpus[0], 
                                                                    [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=3000)])
        except RuntimeError as e:
            print(e)
    serve_job = ServeJob(port = 8080)
    serve_job.serve(["resnet50", "clip"], ["OneClassML/DefaultModels/resnet", "OneClassML/DefaultModels/clip"])