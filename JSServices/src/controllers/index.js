import { UserController } from './UserController.js';
import { LogController } from './LogController.js';
import { ProjectProcessingController } from './ProjectProcessingController.js';
import { RequestController } from './RequestController.js';

const initControllers = ({
    userService,
    projectProcessingService,
    requestService,
    logService,
}) => {
    return {
        userController: new UserController(userService),
        projectProcessingController: new ProjectProcessingController(projectProcessingService),
        requestController: new RequestController(requestService),
        logController: new LogController(logService),
    };
};

export {
    initControllers,
    UserController,
    LogController,
    ProjectProcessingController,
    RequestController
};