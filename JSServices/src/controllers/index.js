import { UserController } from './UserController.js';
import { LogController } from './LogController.js';
import { ProjectProcessingController } from './ProjectProcessingController.js';
import { RequestController } from './RequestController.js';
import { CategoryController } from './CategoryController.js';
import { ModelController } from './ModelController.js';
import { NeuralNetworkController } from './NeuralNetworkController.js';
import { DatasetController } from './DatasetController.js';
import { ProjectController } from './ProjectController.js';
import { LoadStatController } from './LoadStatController.js'; 

const initControllers = ({
    userService,
    projectProcessingService,
    requestService,
    logService,
    categoryService,
    modelService,
    neuralNetworkService,
    datasetService,
    projectService,
    loadStatService,
}) => {
    return {
        userController: new UserController(userService),
        projectProcessingController: new ProjectProcessingController(projectProcessingService),
        requestController: new RequestController(requestService),
        logController: new LogController(logService),
        categoryController: new CategoryController(categoryService),
        modelController: new ModelController(modelService),
        neuralNetworkController: new NeuralNetworkController(neuralNetworkService),
        datasetController: new DatasetController(datasetService),
        projectController: new ProjectController(projectService),
        loadStatController: new LoadStatController(loadStatService),
    };
};

export {
    initControllers,
    UserController,
    LogController,
    ProjectProcessingController,
    RequestController,
    CategoryController,
    ModelController,
    NeuralNetworkController,
    DatasetController,
    ProjectController,
    LoadStatController
};