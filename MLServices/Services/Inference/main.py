""" Web API """
from dotenv import load_dotenv
load_dotenv()

import os
import argparse
from flask import Flask, request, send_file
from flask_cors import CORS
import sys
sys.path.append("Services/")
from InferenceHandler import InferenceHandler
from FileUtils import processFiles, create_result_zip
import config
import tensorflow as tf

app = Flask(__name__)
CORS(app)

inferenceHandler = InferenceHandler(config.ARTIFACTS_DIR, 1)

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
    
    result = inferenceHandler.load(user, project, experiment_str, cropping, kserve_path_classification, kserve_path_crop, token)
    if(result):
        return {
                "message": "Successfully loaded"
            }, 200

    return {
                "message": "Internal server error"
            }, 500
    
@app.route('/stop', methods=['POST'])
def stop_endpoint():
    content = request.get_json()
    user = content["user"]
    project = content["project"]
    experiment_str = content["experiment"]
    cropping = content["cropping"]
    result = inferenceHandler.stop(user, project, experiment_str, cropping)
    if(result):
        return {
                "message": "Successfully stopped"
            }, 200

    return {
                "message": "Internal server error"
            }, 500

@app.route('/process', methods=['POST'])
def process_endpoint():
    content = request.form
    user = content["user"]
    project = content["project"]
    experiment_str = content["experiment"]
    cropping = True if content["cropping"] == "True" else False
    level = int(content["level"])
    similarity = float(content["similarity"]) if "similarity" in content else None
    postprocessing = eval(content["postprocessing"]) if "postprocessing" in content else []
    
    images = request.files.getlist('file')
    process_files_result  = processFiles(images)
    if(process_files_result is None or len(process_files_result[0]) == 0):
        return {
                "message": str(len(process_files_result[0]))
            }, 500
    
    images, filenames = process_files_result
    
    result = inferenceHandler.process(images, user, project, experiment_str, cropping, level, similarity)
    if(result is None):
        return {
                "message": "Error during processing"
            }, 500
    (result_classification, quality, result_crop, validation_time, classification_time, cropping_time) = result
    images = inferenceHandler.postprocess(images, postprocessing, result_crop)
    
    data = create_result_zip(result_classification, quality, result_crop, validation_time, classification_time, cropping_time, filenames, images)
    return send_file(
        data,
        mimetype='application/zip',
        as_attachment=True,
        download_name='result.zip'
    )


if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--memory-limit", "-l", default=2048, help="Limit for gpu", type=int)
    
    args = vars(parser.parse_args())
    
    gpus = tf.config.experimental.list_physical_devices('GPU')
    memory_limit = args['memory_limit']
    if (len(gpus) > 0 and memory_limit is not None):
        try:
            tf.config.experimental.set_virtual_device_configuration(gpus[0], 
                                                                    [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=memory_limit)])
        except RuntimeError as e:
            print(e)
            
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)