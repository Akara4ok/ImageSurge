import { UserRepository } from './UserRepository.js';
import { LogRepository } from './LogRepository.js';
import { ProjectProcessingRepository } from './ProjectProcessingRepository.js';
import { RequestRepository } from './RequestRepository.js';
import { CategoryRepository } from './CategoryRepository.js';
import { ModelRepository } from './ModelRepository.js';
import { NeuralNetworkRepository } from './NeuralNetworkRepository.js';
import { KServeUrlRepository } from './KServeUrlRepository.js';
import { DatasetRepository } from './DatasetRepository.js';
import { ProjectRepository } from './ProjectRepository.js';

const initRepositories = (prismaClient) => {
    return {
        userRepository: new UserRepository(prismaClient),
        logRepository: new LogRepository(prismaClient),
        projectProcessingRepository: new ProjectProcessingRepository(prismaClient),
        requestRepository: new RequestRepository(prismaClient),
        categoryRepository: new CategoryRepository(prismaClient),
        modelRepository: new ModelRepository(prismaClient),
        neuralNetworkRepository: new NeuralNetworkRepository(prismaClient),
        kserveUrlRepository: new KServeUrlRepository(prismaClient),
        datasetRepository: new DatasetRepository(prismaClient),
        projectRepository: new ProjectRepository(prismaClient),
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
    KServeUrlRepository,
    DatasetRepository,
    ProjectRepository
};