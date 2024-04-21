import { wrap } from '../helpers/requests.js';
import { Router } from 'express';
import { UserRoutes } from '../constants/enums/Routes.js';

const initRoutes = ({
    userController,
}) => {
    const routes = Router();

    routes.get(
        UserRoutes.GET_USER,
        wrap(userController.getById.bind(userController)),
    );

    routes.post(
        UserRoutes.CREATE_USER,
        wrap(userController.create.bind(userController)),
    );

    routes.delete(
        UserRoutes.DELETE_USER,
        wrap(userController.delete.bind(userController)),
    );

    routes.put(
        UserRoutes.UPDATE_USER,
        wrap(userController.update.bind(userController)),
    );
    return routes;
};

export { initRoutes };