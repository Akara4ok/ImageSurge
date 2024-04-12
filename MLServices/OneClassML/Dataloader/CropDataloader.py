import xml.etree.ElementTree as ET
from .ImageDataloader import ImageDataloader

REF_SIZE = 224

class CropDataloader(ImageDataloader):
    """ Class for testing crop operation """
    
    def __init__(self, base_folder_path: str, annotation_path: str, ):
        super().__init__(base_folder_path)
        self.annotation_path = base_folder_path + "/" + annotation_path
        
    def recrop_single(xtl: int, ytl: int, xbr: int, ybr: int, width: int, height: int, ref_width: int, ref_height) -> tuple[int, int, int, int]:
        """ Recrop bbox from one size to ref size """
    
        xtl = int(xtl / width * ref_width)
        ytl = int(ytl / height * ref_height)
        xbr = int(xbr / width * ref_width)
        ybr = int(ybr / height * ref_height)
        return xtl, ytl, xbr, ybr, ref_width, ref_height
        
    def get_crop_test_images_path(self) -> list[tuple[str, tuple[int, int, int, int, int, int]]]:
        """ Get dictionary of filepath and its crop rectangle"""
        
        if(not self.annotation_path):
            return
        
        tree = ET.parse(self.annotation_path)
        root = tree.getroot()
        
        result = []

        for image in root.findall('image'):
            name = image.get('name')
            path = self.base_folder_path + "/" + name
            width = int(image.get('width'))
            height = int(image.get('height'))
            xtl = int(float(image.find('box').get('xtl')))
            ytl = int(float(image.find('box').get('ytl')))
            xbr = int(float(image.find('box').get('xbr')))
            ybr = int(float(image.find('box').get('ybr')))
            result.append((path, CropDataloader.recrop_single(xtl, ytl, xbr, ybr, width, height, REF_SIZE, REF_SIZE)))
        
        return result
            