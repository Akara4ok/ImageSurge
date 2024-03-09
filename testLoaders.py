# from Dataloader.DataloaderImpl.GeneralMultiClassDataloader import GeneralMultiClassDataloader

# loader_natural = GeneralMultiClassDataloader("../Data/natural-images/natural_images")
# print(loader_natural.labels)
# loader_faces = GeneralMultiClassDataloader("../Data/faces/multiclass_faces")
# print(loader_faces.get_train_images_paths())

# from Dataloader.DataloaderImpl.GeneralOneClassDataloader import GeneralOneClassDataloader

# loader_dicaprio = GeneralOneClassDataloader("../Data/faces/one_class", "pins_Leonardo DiCaprio", 0.8)
# print(len(loader_dicaprio.get_test_images_paths()))

from Dataloader.CropDataloader import CropDataloader
crop_loader_dicaprio = CropDataloader("../Data/faces", "annotations.xml")
print(crop_loader_dicaprio.get_crop_test_images_path())
