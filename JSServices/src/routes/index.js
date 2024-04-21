import { wrap } from '../helpers/requests.js';
import { Router } from 'express';
import { UserRoutes, LogRoutes, ProjectProcessingRoutes, RequestRoutes } from '../constants/enums/Routes.js';

const initRoutes = ({
    userController,
    logController,
    projectProcessingController,
    requestController,
}) => {
    const routes = Router();

    //user
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

    //logs
    routes.get(
        LogRoutes.GET_LOG,
        wrap(logController.getById.bind(logController)),
    );

    routes.post(
        LogRoutes.CREATE_LOG,
        wrap(logController.create.bind(logController)),
    );

    routes.delete(
        LogRoutes.DELETE_LOG,
        wrap(logController.delete.bind(logController)),
    );

    routes.put(
        LogRoutes.UPDATE_LOG,
        wrap(logController.update.bind(logController)),
    );

    //request
    routes.get(
        RequestRoutes.GET_REQUEST,
        wrap(requestController.getById.bind(requestController)),
    );

    routes.post(
        RequestRoutes.CREATE_REQUEST,
        wrap(requestController.create.bind(requestController)),
    );

    routes.delete(
        RequestRoutes.DELETE_REQUEST,
        wrap(requestController.delete.bind(requestController)),
    );

    routes.put(
        RequestRoutes.UPDATE_REQUEST,
        wrap(requestController.update.bind(requestController)),
    );

    //projectprocessing
    routes.get(
        ProjectProcessingRoutes.GET_PROJECTPROCESSING,
        wrap(projectProcessingController.getById.bind(projectProcessingController)),
    );

    routes.post(
        ProjectProcessingRoutes.CREATE_PROJECTPROCESSING,
        wrap(projectProcessingController.create.bind(projectProcessingController)),
    );

    routes.delete(
        ProjectProcessingRoutes.DELETE_PROJECTPROCESSING,
        wrap(projectProcessingController.delete.bind(projectProcessingController)),
    );

    routes.put(
        ProjectProcessingRoutes.UPDATE_PROJECTPROCESSING,
        wrap(projectProcessingController.update.bind(projectProcessingController)),
    );

    return routes
};

export { initRoutes };