""" Web API """
from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, request
from flask_cors import CORS
import sys
sys.path.append("Services/")
from TrainService import TrainService
from InferenceService import InferenceService
import config

app = Flask(__name__)
CORS(app)

trainService = TrainService(config.DATA_DIR, config.IMAGE_NAME, config.TRAIN_MEMORY_LIMIT)
ifnferenceService = InferenceService(config.INFERENCE_HOST, config.CPU_PORT, config.GPU_PORT)

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
    if(result['StatusCode'] == 0):
        return {
                "message": "Successfully trained"
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
    
    images = request.files.getlist('file')
    
    return ifnferenceService.process(images, user, project, experiment_str, cropping, level, similarity)


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)