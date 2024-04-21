import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class UserNotFoundError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.NOT_FOUND,
            message: 'User was not found!',
        });
    }
}

class UserForbiddenError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: 'Forbidden operation!',
        });
    }
}

export { UserNotFoundError, UserForbiddenError };