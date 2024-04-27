import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ProjectNotFoundError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.NOT_FOUND,
            message: 'Project was not found!',
        });
    }
}

class ProjectForbiddenError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: 'Forbidden operation!',
        });
    }
}

export { ProjectNotFoundError, ProjectForbiddenError };