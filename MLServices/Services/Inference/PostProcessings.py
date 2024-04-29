import cv2
import numpy as np

def blur(img: np.ndarray, kernel: int) -> np.ndarray:
    return cv2.GaussianBlur(img, (kernel, kernel))

def rotate(img: np.ndarray, degree: int) -> np.ndarray:
    if(degree == 90):
        rotated = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
    elif(degree == 180):
        rotated = cv2.rotate(img, cv2.ROTATE_180)
    elif(degree == 270):
        rotated = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return rotated

def flip_vertical(img: np.ndarray) -> np.ndarray:
    return cv2.flip(img, 0)

def flip_horizontal(img: np.ndarray) -> np.ndarray:
    return cv2.flip(img, 1)

def resize(img: np.ndarray, width: int, height: int) -> np.ndarray:
    return cv2.resize(img, (width, height))

def toColorSpace(img: np.ndarray, colorspace: str) -> np.ndarray:
    match colorspace:
        case "RGB":
            return img
        case "BGR":
            return cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
        case "HSV":
            return cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        case "GRAY":
            return cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        case "RGBA":
            return cv2.cvtColor(img, cv2.COLOR_RGB2RGBA)
        case _:
            return img

def crop(img: np.ndarray, left: int, top: int, width: int, height: int) -> np.ndarray:
    img = img[top:top+height, left:left+width]
    return img

def applyPostprocessing(img: np.ndarray, postprocessing: str) -> np.ndarray:
    if(not postprocessing):
        return img
    
    parsed = postprocessing.split(" ")
    if(len(parsed) < 2):
        return img
    
    op = parsed[0]
    match op:
        case 'cropping':
            if(len(parsed) < 5):
                return img
            return crop(img, int(parsed[1]), int(parsed[2]), int(parsed[3]), int(parsed[4]))
        case 'blur':
            return blur(img, int(parsed[1]))
        case 'rotate':
            return rotate(img, int(parsed[1]))
        case 'flip':
            if(parsed[1] == 'H'):
                return flip_horizontal(img)
            else:
                return flip_vertical(img)
        case 'resize':
            if(len(parsed) < 3):
                return img
            return resize(img, int(parsed[1]), int(parsed[2]))
        case 'toColorSpace':
            return toColorSpace(img, parsed[1])
        case _:
            return img
    
def applyPostprocessingToAll(imgs: list[np.ndarray], postprocessing: str, cropping: np.ndarray) -> list[np.ndarray]:
    result = []
    for index, img in enumerate(imgs):
        if(postprocessing == "cropping"):
            postprocessing = "cropping " + str(cropping[index, 0]) + " " + str(cropping[index, 1]) + " " + str(cropping[index, 2] - cropping[index, 0]) + " " + str(cropping[index, 3] - cropping[index, 1]) 
        result.append(applyPostprocessing(img, postprocessing))
    return result