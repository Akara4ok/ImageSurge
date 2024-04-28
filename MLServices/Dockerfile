# Use base image with GPU support.
FROM ubuntu:22.04

RUN apt-get update -y && apt-get install python3 python3-pip -y

WORKDIR /app

COPY non_ml_requirements.txt non_ml_requirements.txt
RUN python3 -m pip install -r non_ml_requirements.txt

COPY main.py main.py
COPY Services/TrainService.py Services/TrainService.py
COPY Services/InferenceService.py Services/InferenceService.py
COPY Services/GpuMemory.py Services/GpuMemory.py
COPY Services/config.py Services/config.py
COPY Services/data_utils.py Services/data_utils.py
COPY OneClassML/utils/non_tf_functions.py OneClassML/utils/non_tf_functions.py
COPY .env .env

ENTRYPOINT python3 main.py