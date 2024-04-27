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

class UserValidationError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.BAD_REQUEST,
            message: 'Wrong input fields',
        });
    }
}

class UserExistsError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: 'Email or phone number are already registered',
        });
    }
}

class UserWrongDataError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.BAD_REQUEST,
            message: 'Invalid email or password',
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

export { UserNotFoundError, UserValidationError, UserWrongDataError, UserExistsError, UserForbiddenError };