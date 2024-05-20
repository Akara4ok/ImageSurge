import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

const DEFAULT_MESSAGE = 'Network Error';

class HttpError extends Error {
    constructor({
        status = HttpStatusCode.INTERNAL_SERVER_ERROR,
        message = DEFAULT_MESSAGE,
    } = {}) {
        super(message);
        this.status = status;
    }
}

export { HttpError };