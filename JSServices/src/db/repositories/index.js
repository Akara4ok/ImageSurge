import { UserRepository } from './UserRepository.js';
import { LogRepository } from './LogRepository.js';
import { ProjectProcessingRepository } from './ProjectProcessingRepository.js';
import { RequestRepository } from './RequestRepository.js';

const initRepositories = (prismaClient) => {
    return {
        userRepository: new UserRepository(prismaClient),
        logRepository: new LogRepository(prismaClient),
        projectProcessingRepository: new ProjectProcessingRepository(prismaClient),
        requestRepository: new RequestRepository(prismaClient),
    };
};

export {
    initRepositories,
    UserRepository,
    LogRepository,
    ProjectProcessingRepository,
    RequestRepository
};