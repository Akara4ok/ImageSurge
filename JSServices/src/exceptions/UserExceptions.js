import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

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

export { UserWrongDataError, UserExistsError };