import { UserService } from './UserService.js';
import { LogService } from './LogService.js';
import { ProjectProcessingService } from './ProjectProcessingService.js';
import { RequestService } from './RequestService.js';
import { CategoryService } from './CategoryService.js';
import { KServeUrlService } from './KServeUrlService.js';
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
    kserveUrlRepository,
    neuralNetworkRepository,
    datasetRepository,
    projectRepository,
}) => {
    return {
        userService: new UserService(userRepository),
        logService: new LogService(logRepository),
        projectProcessingService: new ProjectProcessingService(projectProcessingRepository),
        requestService: new RequestService(requestRepository),
        categoryService: new CategoryService(categoryRepository),
        modelService: new ModelService(modelRepository),
        kserveUrlService: new KServeUrlService(kserveUrlRepository),
        neuralNetworkService: new NeuralNetworkService(neuralNetworkRepository),
        datasetService: new DatasetService(datasetRepository),
        projectService: new ProjectService(projectRepository),
    };
};

export { initServices, 
    UserService, 
    LogService, 
    ProjectProcessingService, 
    RequestService, 
    CategoryService, 
    KServeUrlService, 
    ModelService, 
    NeuralNetworkService,  };