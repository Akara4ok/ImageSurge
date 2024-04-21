import { UserService } from './UserService.js';
import { LogService } from './LogService.js';
import { ProjectProcessingService } from './ProjectProcessingService.js';
import { RequestService } from './RequestService.js';

const initServices = ({
    userRepository,
    logRepository,
    projectProcessingRepository,
    requestRepository,
}) => {
    return {
        userService: new UserService(userRepository),
        logService: new LogService(logRepository),
        projectProcessingService: new ProjectProcessingService(projectProcessingRepository),
        requestService: new RequestService(requestRepository),
    };
};

export { initServices, UserService, LogService, ProjectProcessingService, RequestService };