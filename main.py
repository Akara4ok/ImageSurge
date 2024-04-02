""" Web API """
from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, request
from flask_cors import CORS
import sys
sys.path.append("Services/")
from TrainService import TrainService
import config

app = Flask(__name__)
CORS(app)

trainService = TrainService(config.DATA_DIR, config.IMAGE_NAME, config.TRAIN_MEMORY_LIMIT)

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
    kserve_path = content["kserve-path"] if "kserve-path" in content else None
    local_kserve = content["local-kserve"] if "local-kserve" in content else None
    
    result = trainService.train(user, project, experiment_str, model_name, cropping, data_path, dataset_names, sources, category, kserve_path, local_kserve)
    if(result['StatusCode'] == 0):
        return {
                "message": "Successfully trained"
            }, 200

    return {
                "message": "Internal server error"
            }, 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)