import os

DATA_DIR = "Data/"
ABS_PATH = "/home/vlad/KPI/Dyplom/ImageSurge"
ARTIFACTS_DIR = "Artifacts/"
WORKDIR = "/app/"
IMAGE_NAME = "akara4ok/train-image"
MEMORY_SAFE_RESERVE = 200
TRAIN_MEMORY_LIMIT = 1800
INFERENCE_MEMORY_LIMIT = 1800
LOCAL_LIMIT = 10
LOCAL_BATCH_SIZE = 1
KSERVE_LIMIT = os.getenv("KSERVE_LIMIT") if os.getenv("KSERVE_LIMIT") is not None else 100
KSERVE_BATCH_SIZE = os.getenv("KSERVE_BATCH_SIZE") if os.getenv("KSERVE_BATCH_SIZE") is not None else 32
INFERENCE_HOST = "http://0.0.0.0"
CPU_PORT = 5001
GPU_PORT = 5002