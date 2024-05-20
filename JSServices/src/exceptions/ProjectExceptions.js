import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ProjectExistsError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: 'Project with this name exists',
        });
    }
}

class ProjectTrainingError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Error during training',
        });
    }
}

class ProjectProcessingError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Error during Project Processing',
        });
    }
}

class ProjectNotLoadedError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Project not loaded',
        });
    }
}

export { ProjectExistsError, ProjectTrainingError, ProjectProcessingError, ProjectNotLoadedError };