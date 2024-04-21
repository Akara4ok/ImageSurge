import { UserService } from './UserService.js';

const initServices = ({
    userRepository,
}) => {
    return {
        userService: new UserService(userRepository),
    };
};

export { initServices, UserService };