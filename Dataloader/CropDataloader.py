import xml.etree.ElementTree as ET
from .ImageDataloader import ImageDataloader

class CropDataloader(ImageDataloader):
    """ Class for testing crop operation """
    
    def __init__(self, base_folder_path: str, annotation_path: str):
        super().__init__(base_folder_path)
        self.annotation_path = base_folder_path + "/" + annotation_path
        
    def get_crop_test_images_path(self) -> list[tuple[str, tuple[int, int, int, int, int, int]]]:
        """ Get dictionary of filepath and its crop rectangle"""
        
        if(not self.annotation_path):
            return
        
        tree = ET.parse(self.annotation_path)
        root = tree.getroot()

        first_image = root.find('image')
        width = first_image.get('width')
        height = first_image.get('height')
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
            result.append((path, (xtl, ytl, xbr, ybr, width, height)))
        
        return result
            