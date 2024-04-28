import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class NotFoundError extends HttpError {
    constructor(notFoundObject) {
        super({
            status: HttpStatusCode.NOT_FOUND,
            message: notFoundObject + ' was not found!',
        });
    }
}

class ValidationError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.BAD_REQUEST,
            message: 'Wrong input fields',
        });
    }
}

class ForbiddenError extends HttpError {
    constructor(msg = 'Forbidden operation!') {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: msg,
        });
    }
}

class NoTokenError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.UNAUTHORIZED,
            message: 'Authentication token missing',
        });
    }
}

class InvalidTokenError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: 'Invalid or expired token',
        });
    }
}

export { NotFoundError, ValidationError, ForbiddenError, NoTokenError, InvalidTokenError };