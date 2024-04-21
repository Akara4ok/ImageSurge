import { UserRepository } from './UserRepository.js';

const initRepositories = (prismaClient) => {
    return {
        userRepository: new UserRepository(prismaClient),
    };
};

export {
    initRepositories,
    UserRepository,
};