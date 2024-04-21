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

const ProjectProcessingRoutes = Object.freeze({
    GET_PROJECTPROCESSING: '/projectprocessing/:id',
    CREATE_PROJECTPROCESSING: '/projectprocessing/',
    DELETE_PROJECTPROCESSING: '/projectprocessing/:id',
    UPDATE_PROJECTPROCESSING: '/projectprocessing/:id',
});

export {UserRoutes, RequestRoutes, LogRoutes, ProjectProcessingRoutes}