import { wrap } from '../helpers/requests.js';
import { Router } from 'express';
import { UserRoutes, LogRoutes, ProjectProcessingRoutes, RequestRoutes, 
    KServeUrlRoutes, CategoryRoutes, ModelRoutes, NeuralNetworkRoutes,
    DatasetRoutes, ProjectRoutes } from '../constants/enums/CrudRoutes.js';

const initCrudRoutes = ({
    userController,
    logController,
    projectProcessingController,
    requestController,
    categoryController,
    modelController,
    kserveUrlController,
    neuralNetworkController,
    datasetController,
    projectController,
}) => {
    const routes = Router();

    //user
    routes.get(
        UserRoutes.GET_USER,
        wrap(userController.getById.bind(userController)),
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

    //category
    routes.get(
        CategoryRoutes.GET_CATEGORY,
        wrap(categoryController.getById.bind(categoryController)),
    );

    routes.post(
        CategoryRoutes.CREATE_CATEGORY,
        wrap(categoryController.create.bind(categoryController)),
    );

    routes.delete(
        CategoryRoutes.DELETE_CATEGORY,
        wrap(categoryController.delete.bind(categoryController)),
    );

    routes.put(
        CategoryRoutes.UPDATE_CATEGORY,
        wrap(categoryController.update.bind(categoryController)),
    );

    //models
    routes.get(
        ModelRoutes.GET_MODEL,
        wrap(modelController.getById.bind(modelController)),
    );

    routes.post(
        ModelRoutes.CREATE_MODEL,
        wrap(modelController.create.bind(modelController)),
    );

    routes.delete(
        ModelRoutes.DELETE_MODEL,
        wrap(modelController.delete.bind(modelController)),
    );

    routes.put(
        ModelRoutes.UPDATE_MODEL,
        wrap(modelController.update.bind(modelController)),
    );

    //neuralNetwork
    routes.get(
        NeuralNetworkRoutes.GET_NEURALNETWORK,
        wrap(neuralNetworkController.getById.bind(neuralNetworkController)),
    );

    routes.post(
        NeuralNetworkRoutes.CREATE_NEURALNETWORK,
        wrap(neuralNetworkController.create.bind(neuralNetworkController)),
    );

    routes.delete(
        NeuralNetworkRoutes.DELETE_NEURALNETWORK,
        wrap(neuralNetworkController.delete.bind(neuralNetworkController)),
    );

    routes.put(
        NeuralNetworkRoutes.UPDATE_NEURALNETWORK,
        wrap(neuralNetworkController.update.bind(neuralNetworkController)),
    );

    //kserveurl
    routes.get(
        KServeUrlRoutes.GET_KSERVEURL,
        wrap(kserveUrlController.getById.bind(kserveUrlController)),
    );

    routes.post(
        KServeUrlRoutes.CREATE_KSERVEURL,
        wrap(kserveUrlController.create.bind(kserveUrlController)),
    );

    routes.delete(
        KServeUrlRoutes.DELETE_KSERVEURL,
        wrap(kserveUrlController.delete.bind(kserveUrlController)),
    );

    routes.put(
        KServeUrlRoutes.UPDATE_KSERVEURL,
        wrap(kserveUrlController.update.bind(kserveUrlController)),
    );

    //dataset
    routes.get(
        DatasetRoutes.GET_DATASET,
        wrap(datasetController.getById.bind(datasetController)),
    );

    routes.post(
        DatasetRoutes.CREATE_DATASET,
        wrap(datasetController.create.bind(datasetController)),
    );

    routes.put(
        DatasetRoutes.UPDATE_DATASET,
        wrap(datasetController.update.bind(datasetController)),
    );

    //project
    routes.get(
        ProjectRoutes.GET_PROJECT,
        wrap(projectController.getById.bind(projectController)),
    );

    routes.post(
        ProjectRoutes.CREATE_PROJECT,
        wrap(projectController.create.bind(projectController)),
    );

    routes.put(
        ProjectRoutes.UPDATE_PROJECT,
        wrap(projectController.update.bind(projectController)),
    );

    return routes
};

export { initCrudRoutes };