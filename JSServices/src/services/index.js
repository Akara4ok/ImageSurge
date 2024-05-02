import { UserService } from './UserService.js';
import { LogService } from './LogService.js';
import { ProjectProcessingService } from './ProjectProcessingService.js';
import { RequestService } from './RequestService.js';
import { CategoryService } from './CategoryService.js';
import { ModelService } from './ModelService.js';
import { NeuralNetworkService } from './NeuralNetworkService.js';
import { DatasetService } from './DatasetService.js';
import { ProjectService } from './ProjectService.js';
import { LoadStatService } from './LoadStatService.js';

const initServices = ({
    userRepository,
    logRepository,
    projectProcessingRepository,
    requestRepository,
    categoryRepository,
    modelRepository,
    neuralNetworkRepository,
    datasetRepository,
    projectRepository,
    loadStatRepository
}) => {
    const categoryService = new CategoryService(categoryRepository);
    const datasetService = new DatasetService(datasetRepository, categoryService);
    const neuralNetworkService = new NeuralNetworkService(neuralNetworkRepository);
    const modelService = new ModelService(modelRepository);
    const projectProcessingService = new ProjectProcessingService(projectProcessingRepository);
    const logService = new LogService(logRepository);
    const requestService = new RequestService(requestRepository);
    const loadStatService = new LoadStatService(loadStatRepository);
    const projectService = new ProjectService(projectRepository, datasetService, neuralNetworkService, modelService, categoryService, logService, requestService, loadStatService);
    return {
        userService: new UserService(userRepository),
        requestService: projectService,
        logService: logService,
        projectProcessingService: projectProcessingService,
        categoryService: categoryService,
        modelService: modelService,
        neuralNetworkService: neuralNetworkService,
        datasetService: datasetService,
        projectService: projectService,
        loadStatService: loadStatService,
    };
};

export { initServices, 
    UserService, 
    LogService, 
    ProjectProcessingService, 
    RequestService, 
    CategoryService, 
    ModelService, 
    NeuralNetworkService, 
    LoadStatService
};