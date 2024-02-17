import xml.etree.ElementTree as ET
from abc import  abstractmethod
from TrainDataloader import TrainDataloader

class OneClassDataloader(TrainDataloader):
    """ Abstract class for train data loading """
    
    def __init__(self, base_folder_path: str, annotation_path: str):
        super().__init__(base_folder_path)
        self.annotation_path = base_folder_path + "/" + annotation_path
        
    @abstractmethod
    def get_test_images_paths(self) -> list[tuple[str, int]]:
        """ Load test images paths from folder and its label """
        pass
        
    def get_crop_info(self) -> tuple[dict[str, tuple[int, int, int, int]], tuple[int, int]]:
        """ Get dictionary of filepath adn its crop rectangle"""
        
        print(self.annotation_path)
        
        tree = ET.parse(self.annotation_path)
        root = tree.getroot()

        first_image = root.find('image')
        width = first_image.get('width')
        height = first_image.get('height')
        result = {}

        for image in root.findall('image'):
            name = image.get('name')
            xtl = image.find('box').get('xtl')
            ytl = image.find('box').get('ytl')
            xbr = image.find('box').get('xbr')
            ybr = image.find('box').get('ybr')
            result[name] = (xtl, ytl, xbr, ybr)
        
        return result, (width, height)
            