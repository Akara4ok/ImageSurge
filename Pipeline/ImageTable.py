import enum
import numpy as np
import cv2
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import MeanShift, KMeans, DBSCAN
from sklearn.base import ClusterMixin

from.utils.SklearnInterface import SklearnInterface
from utils.functions import calculate_similarity, get_cluster_label, get_cluster_num

class ImageTableAlgo(enum.Enum):
    Similarity = 1
    Clustering = 2
    ClusteringAuto = 3

class Cell:
    """ Class represents small rectangle of image """
    def __init__(self, x, y, size_x, size_y):
        self.x = x
        self.y = y
        self.size_x = size_x
        self.size_y = size_y
        self.recognized_count = 0
    
    def union(self, tl_x: int, tl_y: int, br_x: int, br_y: int) -> tuple[int, int, int, int]:
        """ Union of 2 cells """
        if(tl_x == -1):
            tl_x = self.x
        else:
            tl_x = min(self.x, tl_x)
            
        if(tl_y == -1):
            tl_y = self.y
        else:
            tl_y = min(self.y, tl_y)
            
        if(br_x == -1):
            br_x = self.x
        else:
            br_x = max(self.x + self.size_x, br_x)
            
        if(br_y == -1):
            br_y = self.y
        else:
            br_y = max(self.y + self.size_y, br_y)
        return tl_x, tl_y, br_x, br_y

class BigBox:
    """ Class for building image of nxn small cells """
    def __init__(self, small_boxes: list[Cell]):
        self.x = small_boxes[0].x
        self.y = small_boxes[0].y
        x2 = small_boxes[0].y
        y2 = small_boxes[0].y
        for box in small_boxes:
            self.x = min(self.x, box.x)
            self.y = min(self.y, box.y)
            x2 = max(x2, box.x + box.size_x)
            y2 = max(y2, box.y + box.size_y)
        self.size_x = x2 - self.x
        self.size_y = y2 - self.y
        self.small_boxes = small_boxes
    
    def check_recognized(self) -> None:
        """ Update recognized in cells """
        for box in self.small_boxes:
            box.recognized_count += 1

class ImageTable:
    """ Class for building big an small cells and cropping image """
    def __init__(self, image: np.ndarray, small_box_count: int, small_box_in_big: int, cluster_center: np.ndarray):
        self.small_box_count = small_box_count
        self.small_box_in_big = small_box_in_big
        
        self.image = image
        
        self.width = image.shape[0]
        self.height = image.shape[1]
        
        self.cluster_center = cluster_center
        
        max_dim = max(self.width, self.height)
        self.step = int(max_dim / small_box_count)
        
        self.cells: list[list[Cell]] = self.build_small_cells()
        self.big_boxes: list[BigBox] = self.build_big_boxes()
        
        self.calc_similarity: float = None
    
    def build_small_cells(self) -> list[list[Cell]]:
        """ Cut image to small cells """
        cur_y = 0
        cells: list[list[Cell]] = []
        while cur_y < self.height:
            cur_x = 0
            current_row: list[Cell] = []
            cur_cell_in_row = 0
            while cur_x < self.width:
                cur_cell_in_row += 1
                if(cur_x + self.step > self.width and cur_y + self.step > self.height):
                    cells[-1][-1].size_x = self.width - cells[-1][-1].x
                    cells[-1][-1].size_y = self.height - cells[-1][-1].y
                    break
                    
                if(cur_x + self.step > self.width):
                    current_row[-1].size_x = self.width - current_row[-1].x
                    break
                
                if(cur_y + self.step > self.height):
                    cells[-1][cur_cell_in_row - 1].size_y = self.height - cells[-1][cur_cell_in_row - 1].y
                    cur_x += self.step
                    continue
                
                current_row.append(Cell(cur_x, cur_y, self.step, self.step))
                cur_x += self.step
            cur_y += self.step
            if(len(current_row) > 0):
                cells.append(current_row)
        return cells
            
    def build_big_boxes(self) -> list[BigBox]:
        """ Create big boxes from cells """
        big_boxes: list[BigBox] = []
        for y in range(len(self.cells) + 1 - self.small_box_in_big):
            for x in range(len(self.cells[y]) + 1 - self.small_box_in_big):
                bix_box_cells = []
                for y1 in range(self.small_box_in_big):
                    for x1 in range(self.small_box_in_big):
                        bix_box_cells.append(self.cells[y + y1][x + x1])
                big_boxes.append(BigBox(bix_box_cells))
        return big_boxes
    
    def clear_recognized(self):
        """ Clear all info about recognized cells """
        for row in self.cells:
            for box in row:
                box.recognized_count = 0
            
    def crop_images_to_boxes(self) -> np.ndarray:
        """ Returns big boxes as resized image """
        result = []
        for box in self.big_boxes:
            cropped_image = self.image[box.y:box.y+box.size_y, box.x:box.x+box.size_x]
            cropped_image = cv2.resize(cropped_image, (224, 224))
            result.append(cropped_image)
        return np.asarray(result)

    def similarity_algo(self, cropped_features: np.ndarray, similarity: float = None) -> None:
        """ Similarity algo """
        self.clear_recognized()
        similarities = cosine_similarity(cropped_features, self.cluster_center).flatten()
        if(similarity is None):
            similarity = calculate_similarity(similarities)
            self.calc_similarity = similarity
        for i, box in enumerate(self.big_boxes):
            if(similarities[i] > similarity):
                box.check_recognized()
    
    def clusters_algo(self, cropped_features: np.ndarray, cluster_engine: ClusterMixin,
                      cluster_num: int = None, feature_reduction: SklearnInterface = None) -> None:
        """ Cluster algo with particular number of clusters """
        
        self.clear_recognized()
        if(feature_reduction is not None):
            cropped_features = feature_reduction.fit_transform(cropped_features)
        
        if(cluster_num is None):
            cluster_num = get_cluster_num(cluster_engine.__class__, cropped_features, 10)
        
        cluster_engine = cluster_engine.__class__(n_clusters = cluster_num)
        clustering = cluster_engine.fit(cropped_features)
        label = get_cluster_label(cropped_features, clustering.labels_, self.cluster_center)
        for i, box in enumerate(self.big_boxes):
            if(clustering.labels_[i] == label):
                box.check_recognized()

         
    def auto_clusters_algo(self, cropped_features: np.ndarray, cluster_engine: ClusterMixin,
                           feature_reduction: SklearnInterface = None) -> None:
        """ Cluster algo with automatic number of clusters """
        self.clear_recognized()
        if(feature_reduction is not None):
            cropped_features = feature_reduction.fit_transform(cropped_features)
        clustering = cluster_engine.fit(cropped_features)
        label = get_cluster_label(cropped_features, clustering.labels_, self.cluster_center)
        for i, box in enumerate(self.big_boxes):
            if(clustering.labels_[i] == label):
                box.check_recognized()
                
    
    def get_crop_bbox(self, cropped_features: np.ndarray, level: int = 15, 
                      algo: ImageTableAlgo = ImageTableAlgo.Similarity, **kwargs) -> tuple[int, int, int, int]:
        """ Get coordinates of rectangle to crop """
        match algo:
            case ImageTableAlgo.Similarity:
                self.similarity_algo(cropped_features, **kwargs)
            case ImageTableAlgo.Clustering:
                self.clusters_algo(cropped_features, **kwargs)
            case ImageTableAlgo.ClusteringAuto:
                self.auto_clusters_algo(cropped_features, **kwargs)
            case _:
                raise Exception(f"Undefined algo {algo}")
        
        tl_x = -1
        tl_y = -1
        br_x = -1
        br_y = -1
        
        for row in self.cells:
            for box in row:
                if(box.recognized_count >= level):
                    tl_x, tl_y, br_x, br_y = box.union(tl_x, tl_y, br_x, br_y)
                    
        tl_x = max(tl_x, 0)
        tl_y = max(tl_y, 0)
        br_x = br_x if br_x != -1 else self.width
        br_y = br_y if br_y != -1 else self.height
        return tl_x, tl_y, br_x, br_y