""" Util class to work with files """
import sys
import io
import cv2
import numpy as np
from PIL import Image, ImageOps

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/bmp"}

def processFiles(files: list) -> tuple[list[np.ndarray], str]:
    """ Process array of images """
    images = []
    filenames = []
    for file in files:
        if (file.content_type not in ALLOWED_CONTENT_TYPES):
            continue

        try:
            input_image = Image.open(file).convert("RGB")
            input_image = ImageOps.exif_transpose(input_image)
        except:
            continue
            
        image = np.array(input_image)
        images.append(image)
        filenames.append(file.filename)

    return (images, filenames)