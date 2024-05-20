import enum
import shutil
import os
import gdown
import subprocess
import zipfile

class DatasetSource(enum.Enum):
    LocalZip = 1
    LocalFolder = 2
    Minio = 3
    GDrive = 4
    
def download(path: str, default_folder, dataset_name: str = "", source: int = 1) -> str:
    folder_res = default_folder + dataset_name
    if(os.path.exists(folder_res)):
        return folder_res
    if(os.path.exists(folder_res + ".zip")):
        return folder_res + ".zip"
    
    source = DatasetSource(source)
    
    match source:
        case DatasetSource.LocalZip:
            print(path, default_folder + dataset_name + ".zip")
            shutil.copyfile(path, default_folder + dataset_name + ".zip")
            return folder_res
        case DatasetSource.LocalFolder:
            shutil.copytree(path, default_folder + dataset_name)
            return folder_res
        case DatasetSource.Minio:
            subprocess.call(["mc", "cp", "--recursive", path, default_folder])
        case DatasetSource.GDrive:
            gdown.download(path, default_folder + dataset_name + ".zip", fuzzy=True)
    return folder_res + ".zip"
            
def unzip(path: str, default_folder, dataset_name: str):
    if(os.path.isdir(path)):
        return
    
    save_path = default_folder + dataset_name
    if(os.path.isdir(save_path)):
        return
    if(not path.lower().endswith(('.zip'))):
        return
        
    with zipfile.ZipFile(path, 'r') as zip_ref:
        zip_ref.extractall(save_path)
        
        def get_single_subdirectory(path: str) -> str:
            subdirectories = [name for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))]
            if len(subdirectories) == 1:
                return path + "/" + subdirectories[0]
            else:
                return None
        def move_files_and_delete_folder(src_folder: str, dest_folder: str) -> None:
            for file_name in os.listdir(src_folder):
                src_file_path = os.path.join(src_folder, file_name)
                dest_file_path = os.path.join(dest_folder, file_name)
                shutil.move(src_file_path, dest_file_path)

            os.rmdir(src_folder)
                    
        subfolder = get_single_subdirectory(save_path)
        if(subfolder is not None):
            move_files_and_delete_folder(subfolder, save_path)