import { UserController } from './UserController.js';

const initControllers = ({
    userService,
}) => {
    return {
        userController: new UserController(userService),
    };
};

export {
    initControllers,
    UserController,
};