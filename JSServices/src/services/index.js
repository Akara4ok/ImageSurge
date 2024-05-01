import { UserService } from './UserService.js';
import { LogService } from './LogService.js';
import { ProjectProcessingService } from './ProjectProcessingService.js';
import { RequestService } from './RequestService.js';
import { CategoryService } from './CategoryService.js';
import { ModelService } from './ModelService.js';
import { NeuralNetworkService } from './NeuralNetworkService.js';
import { DatasetService } from './DatasetService.js';
import { ProjectService } from './ProjectService.js';

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
}) => {
    const categoryService = new CategoryService(categoryRepository);
    const datasetService = new DatasetService(datasetRepository, categoryService);
    const neuralNetworkService = new NeuralNetworkService(neuralNetworkRepository);
    const modelService = new ModelService(modelRepository);
    const projectProcessingService = new ProjectProcessingService(projectProcessingRepository);
    const logService = new LogService(logRepository);
    const projectService = new ProjectService(projectRepository, datasetService, neuralNetworkService, modelService, categoryService, logService);
    return {
        userService: new UserService(userRepository),
        requestService: new RequestService(requestRepository),
        logService: logService,
        projectProcessingService: projectProcessingService,
        categoryService: categoryService,
        modelService: modelService,
        neuralNetworkService: neuralNetworkService,
        datasetService: datasetService,
        projectService: projectService,
    };
};

export { initServices, 
    UserService, 
    LogService, 
    ProjectProcessingService, 
    RequestService, 
    CategoryService, 
    ModelService, 
    NeuralNetworkService,  };