const UserRoutes = Object.freeze({
    GET_USER: '/user/:id',
    CREATE_USER: '/user/',
    DELETE_USER: '/user/:id',
    UPDATE_USER: '/user/:id',
});

const RequestRoutes = Object.freeze({
    GET_REQUEST: '/request/:id',
    CREATE_REQUEST: '/request/',
    DELETE_REQUEST: '/request/:id',
    UPDATE_REQUEST: '/request/:id',
});

const LogRoutes = Object.freeze({
    GET_LOG: '/log/:id',
    CREATE_LOG: '/log/',
    DELETE_LOG: '/log/:id',
    UPDATE_LOG: '/log/:id',
});

const LoadStatRoutes = Object.freeze({
    GET_LOADSTAT: '/loadstat/:id',
    CREATE_LOADSTAT: '/loadstat/',
    DELETE_LOADSTAT: '/loadstat/:id',
    UPDATE_LOADSTAT: '/loadstat/:id',
});

const ProjectProcessingRoutes = Object.freeze({
    GET_PROJECTPROCESSING: '/projectprocessing/:id',
    CREATE_PROJECTPROCESSING: '/projectprocessing/',
    DELETE_PROJECTPROCESSING: '/projectprocessing/:id',
    UPDATE_PROJECTPROCESSING: '/projectprocessing/:id',
});

const CategoryRoutes = Object.freeze({
    GET_CATEGORY: '/category/:id',
    GET_CATEGORIES: '/category/all',
    CREATE_CATEGORY: '/category/',
    DELETE_CATEGORY: '/category/:id',
    UPDATE_CATEGORY: '/category/:id',
});

const ModelRoutes = Object.freeze({
    GET_MODEL: '/model/:id',
    GET_MODELS: '/model/all',
    CREATE_MODEL: '/model/',
    DELETE_MODEL: '/model/:id',
    UPDATE_MODEL: '/model/:id',
});

const NeuralNetworkRoutes = Object.freeze({
    GET_NEURALNETWORK: '/neuralnetwork/:id',
    CREATE_NEURALNETWORK: '/neuralnetwork/',
    DELETE_NEURALNETWORK: '/neuralnetwork/:id',
    UPDATE_NEURALNETWORK: '/neuralnetwork/:id',
});

const DatasetRoutes = Object.freeze({
    GET_DATASET: '/dataset/:id',
    UPDATE_DATASET: '/dataset/:id',
});

const ProjectRoutes = Object.freeze({
    GET_PROJECT: '/project/:id',
    CREATE_PROJECT: '/project/',
    UPDATE_PROJECT: '/project/:id',
});

export {
    UserRoutes, RequestRoutes, LogRoutes, 
    ProjectProcessingRoutes, CategoryRoutes, 
    ModelRoutes, NeuralNetworkRoutes,
    ProjectRoutes, DatasetRoutes, LoadStatRoutes
}