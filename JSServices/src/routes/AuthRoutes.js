import { wrap } from '../helpers/requests.js';
import { Router } from 'express';
import { AuthRoutes } from '../constants/enums/AuthRoutes.js';

const initAuthRoutes = (
    userController
) => {
    const routes = Router();

    //user
    routes.post(
        AuthRoutes.REGISTER,
        wrap(userController.create.bind(userController)),
    );

    routes.post(
        AuthRoutes.LOGIN,
        wrap(userController.login.bind(userController)),
    );

    return routes
};

export { initAuthRoutes };