""" Web API """
from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, request, Response
from flask_cors import CORS
from flask_sock import Sock
import sys
sys.path.append("Services/")
from TrainService import TrainService
from InferenceService import InferenceService
from GpuMemory import GpuMemory
import config
app = Flask(__name__)
CORS(app)
sock = Sock(app)

trainService = TrainService(config.DATA_DIR, config.ABS_PATH, config.IMAGE_NAME)
ifnferenceService = InferenceService(config.INFERENCE_HOST, config.CPU_PORT, config.GPU_PORT)
GpuMemory().set_train_container_limit(config.TRAIN_MEMORY_LIMIT)
GpuMemory().set_inference_limit(config.INFERENCE_MEMORY_LIMIT)

@app.route('/train', methods=['POST'])
def train_endpoint():
    content = request.get_json()
    user = content["user"]
    project = content["project"]
    experiment_str = content["experiment"]
    model_name = content["model_name"]
    cropping = content["cropping"]
    data_path = content["data-path"]
    dataset_names = content["dataset-names"]
    sources = content["sources"]
    
    category = content["category"] if "category" in content else None
    kserve_path_classification = content["kserve-path-classification"] if "kserve-path-classification" in content else None
    kserve_path_crop = content["kserve-path-crop"] if "kserve-path-crop" in content else None
    local_kserve = content["local-kserve"] if "local-kserve" in content else None
    
    result = trainService.train(user, project, experiment_str, model_name, cropping, data_path, dataset_names, sources, category, 
                                kserve_path_classification, kserve_path_crop, local_kserve)
    if(result == 0):
        return {
                "message": "Training successfully started"
            }, 200

    return {
                "message": "Internal server error"
            }, 500
    
@app.route('/load', methods=['POST'])
def load_endpoint():
    content = request.get_json()
    user = content["user"]
    project = content["project"]
    experiment_str = content["experiment"]
    cropping = content["cropping"]
    kserve_path_classification = content["kserve-path-classification"] if "kserve-path-classification" in content else None
    kserve_path_crop = content["kserve-path-crop"] if "kserve-path-crop" in content else None
    token = content["token"] if "token" in content else None
    
    return ifnferenceService.load(user, project, experiment_str, cropping, kserve_path_classification, kserve_path_crop, token)


@app.route('/stop', methods=['POST'])
def stop_endpoint():
    content = request.get_json()
    user = content["user"]
    project = content["project"]
    experiment_str = content["experiment"]
    cropping = content["cropping"]
    return ifnferenceService.stop(user, project, experiment_str, cropping)
    
@app.route('/process', methods=['POST'])
def process_endpoint():
    content = request.form
    user = content["user"]
    project = content["project"]
    experiment_str = content["experiment"]
    cropping = content["cropping"]
    level = content["level"]
    similarity = content["similarity"] if "similarity" in content else None
    postprocessing = content["postprocessing"]
    
    images = request.files.getlist('file')
    
    response = ifnferenceService.process(images, user, project, experiment_str, cropping, level, similarity=similarity, postprocessing=postprocessing)
    if(response.status_code != 200):
        return response.json(), response.status_code
    else:
        return Response(
            response.content,
            headers = dict(response.headers)
        )

@sock.route('/train_ws')
def echo(ws):
    trainService.add_socket(ws)
    while True:
        data = ws.receive()
    

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)