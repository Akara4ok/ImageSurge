import { UserRepository } from './UserRepository.js';
import { LogRepository } from './LogRepository.js';
import { ProjectProcessingRepository } from './ProjectProcessingRepository.js';
import { RequestRepository } from './RequestRepository.js';
import { CategoryRepository } from './CategoryRepository.js';
import { ModelRepository } from './ModelRepository.js';
import { NeuralNetworkRepository } from './NeuralNetworkRepository.js';
import { DatasetRepository } from './DatasetRepository.js';
import { ProjectRepository } from './ProjectRepository.js';
import { LoadStatRepository } from './LoadStatRepository.js';

const initRepositories = (prismaClient) => {
    return {
        userRepository: new UserRepository(prismaClient),
        logRepository: new LogRepository(prismaClient),
        projectProcessingRepository: new ProjectProcessingRepository(prismaClient),
        requestRepository: new RequestRepository(prismaClient),
        categoryRepository: new CategoryRepository(prismaClient),
        modelRepository: new ModelRepository(prismaClient),
        neuralNetworkRepository: new NeuralNetworkRepository(prismaClient),
        datasetRepository: new DatasetRepository(prismaClient),
        projectRepository: new ProjectRepository(prismaClient),
        loadStatRepository: new LoadStatRepository(prismaClient),
    };
};

export {
    initRepositories,
    UserRepository,
    LogRepository,
    ProjectProcessingRepository,
    RequestRepository,
    CategoryRepository,
    ModelRepository,
    NeuralNetworkRepository,
    DatasetRepository,
    ProjectRepository,
    LoadStatRepository
};