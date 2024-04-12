import requests
import os
import argparse
import time
from websocket import create_connection

def warmup(main_service_url: str, data_path: str, dataset_names: str, sources: str, 
          kserve_path: str = None, local_kserve: bool = True, sleep_time: int = 120) -> None:
    """ gpu warmup """
    time.sleep(sleep_time)
    
    ws_url = main_service_url.replace("http", "ws")
    ws_url = ws_url.replace("https", "wss")
    ws = create_connection(ws_url + "/train_ws")

    user = "default"
    project = "default"
    experiment = "default"
    train_data = {
        "user": user,
        "project": project,
        "experiment": experiment,
        "model_name": "Resnet",
        "cropping": True,
        "data-path": [data_path],
        "dataset-names": [dataset_names],
        "sources": [sources],
        "local-kserve": local_kserve
    }
    if(kserve_path):
        train_data["kserve-path-classification"] = kserve_path
        train_data["kserve-path-crop"] = kserve_path
        
    result = requests.post(main_service_url + "/train", json=train_data)
    print("Training start res", result.status_code, result.json())
    print("Training end res", ws.recv())
    ws.close()
    load_data = {
        "user": user,
        "project": project,
        "experiment": experiment,
        "cropping": True,
        "local-kserve": local_kserve
    }
    if(kserve_path):
        load_data["kserve-path-classification"] = kserve_path
        load_data["kserve-path-crop"] = kserve_path
        
    result = requests.post(main_service_url + "/load", json=load_data)
    print("Loading res", result.status_code, result.json())
    
    dataset_path = data_path + "/" + dataset_names + "/"
    name = os.listdir(dataset_path)[0]
    multipart_form_data = [
            ('user', (None, user)),
            ('project', (None, project)),
            ('experiment', (None, experiment)),
            ('cropping', (None, True)),
            ('level', (None, 15)),
            ('file', (name, open(dataset_path + name, 'rb'), "image/jpg")),
        ]
    result = requests.post(main_service_url + "/process", files=multipart_form_data)
    print("Processing res", result.status_code, result.json())
    
    stop_data = {
        "user": user,
        "project": project,
        "experiment": experiment,
        "cropping": True
    }
    result = requests.post(main_service_url + "/stop", json=stop_data)
    print("Stopping res", result.status_code, result.json())


if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--main-service", "-m", default=os.getenv('MAIN_SERVICE_URL'), help="Url for main service", type=str)
    
    parser.add_argument("--data-path", "-d", default=os.getenv('DATA_PATH'), help="Data path", type=str)
    parser.add_argument("--data-name", "-n", default="Warmup", help="Dataset name", type=str)
    parser.add_argument("--source", "-s", default=1, help="Dataset source", type=int)
    
    parser.add_argument("--kserve-path", "-k", default=os.getenv('KSERVE_PATH'), help="Kserve path", type=str)
    parser.add_argument("--local-kserve", "-l", default=os.getenv('LOCAL'), help="Is kserve local", type=str)
    parser.add_argument("--sleep", "-w", default=120, help="Time before sleeping", type=int)
    
    args = vars(parser.parse_args())
    print("WARMUP START")
    warmup(
        args['main_service'],
        args['data_path'],
        args['data_name'],
        args['source'],
        args['kserve_path'],
        args['local_kserve'] == "True",
        args['sleep'],
        )
    print("WARMUP END")