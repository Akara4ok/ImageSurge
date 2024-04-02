from dotenv import load_dotenv
load_dotenv()

import os
import argparse
import sys
sys.path.append("OneClassML")
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn import svm
from Pipeline.ModelHandlers.ModelFactory import ModelFactory
from utils.ExperimentInfo import ExperimentInfo
from Pipeline.utils.FileHandler import FileHandler
from Pipeline.OneClassClassificationTrain import OneClassClassificationTrain
from Dataloader.DataloaderImpl.InferenceDataloader import InferenceDataloader
from Dataloader.DataloaderImpl.GeneralMultiClassDataloader import GeneralMultiClassDataloader
from Dataset.TrainOneClassDataset import TrainOneClassDataset
from Dataset.TrainRefDataset import TrainRefDataset

def train(user: str, project: str, experiment_str: str, model_name: str, cropping: bool, data_path: list[str], ref_data_path: str = "",
          kserve_path: str = None, token: str = None, save_path: str = "Artifacts/"):
    """ full pipeline training """
    experiment = ExperimentInfo(user, project, experiment_str)
    file_handler = FileHandler(save_path, experiment)
    train_pipeline = OneClassClassificationTrain(file_handler)

    #configure
    model = ModelFactory.create_model(model_name, kserve_path, token)
    oc_svm_clf = svm.OneClassSVM(kernel='rbf', nu=0.08)
    ss = StandardScaler()

    #loading data to dataset instance
    dataloader_one_class = InferenceDataloader.create_from_multiple_paths(data_path)
    dataset = None
    if(model_name == "ImprovedResnet"):
        dataloader_multi_class = GeneralMultiClassDataloader(ref_data_path)
        dataset = TrainRefDataset(224, 224, 12, 42, dataloader_one_class, dataloader_multi_class)
    else:
        dataset = TrainOneClassDataset(224, 224, 10, 42, dataloader_one_class)

    #training pipeline
    train_pipeline.configure(model, oc_svm_clf, ss)
    train_pipeline.train(dataset, epochs=3, save_cache=True)
    train_pipeline.save()
    
    if(cropping is None or not cropping):
        return
    
    experiment_crop_str = experiment_str + "-crop"
    experiment_crop = ExperimentInfo(user, project, experiment_crop_str)
    file_handler_crop = FileHandler(save_path, experiment_crop)
    train_pipeline_crop = OneClassClassificationTrain(file_handler_crop)
    
    model_crop = ModelFactory.create_model("Resnet", kserve_path, token)
    oc_svm_crop = svm.OneClassSVM(kernel='rbf', nu=0.08)
    
    train_pipeline_crop.configure(model_crop, oc_svm_crop)
    
    if(model_name == "Resnet" or model_name == "VGG"):
        cache = train_pipeline.get_cache_data()
        train_pipeline_crop.cache_features(cache[0], cache[1])
    
    train_pipeline_crop.train(dataset, use_cache=True)
    train_pipeline_crop.save()


if __name__ == "__main__":
    parser=argparse.ArgumentParser()

    parser.add_argument("--user", "-u", default=os.getenv('USER'), help="user id", type=str)
    parser.add_argument("--project", "-p", default=os.getenv('PROJECT'), help="project id", type=str)
    parser.add_argument("--experiment", "-e", default=os.getenv('EXPERIMENT'), help="experiment id", type=str)
    
    parser.add_argument("--model-name", "-m", default=os.getenv('MODEL_NAME'), help="model name(VGG, Resnet, ImprovedResnet, Clip", type=str)
    parser.add_argument("--cropping", "-c", default=os.getenv('CROPPING'), help="Need cropping", type=bool)
    
    parser.add_argument("--data-path", "-d", default=os.getenv('DATA_PATH'), help="Data path(separated by comma)", type=str)
    parser.add_argument("--ref-data-path", "-r", default=os.getenv('REF_DATA_PATH'), help="Reference datapath if needed", type=str)
    
    parser.add_argument("--kserve-path", "-k", default=os.getenv('KSERVE_PATH'), help="Kserve path if needed", type=str)
    parser.add_argument("--token", "-t", default=os.getenv('TOKEN'), help="token for kserve", type=str)

    parser.add_argument("--save-folder", "-s", default=os.getenv('SAVE_FOLDER'), help="Save folder path", type=str)
    
    parser.add_argument("--memory-limit", "-l", default=os.getenv('MEMORY_LIMIT'), help="Limit for gpu", type=int)
    
    args = vars(parser.parse_args())
    
    gpus = tf.config.experimental.list_physical_devices('GPU')
    memory_limit = args['memory_limit']
    if (len(gpus) > 0 and memory_limit is not None):
        try:
            tf.config.experimental.set_virtual_device_configuration(gpus[0], 
                                                                    [tf.config.experimental.VirtualDeviceConfiguration(memory_limit=memory_limit)])
        except RuntimeError as e:
            print(e)

    
    print("TRAINING START")
    
    try:
        train(args['user'],
            args['project'],
            args['experiment'],
            args['model_name'],
            args['cropping'],
            [x for x in args['data_path'].split(',')],
            args['ref_data_path'],
            args['kserve_path'],
            args['token'],
            args['save_folder'],
            )
    except:
        sys.exit(1)
        
    print("TRAINING END")