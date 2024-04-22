import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class KServeUrlNotFoundError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.NOT_FOUND,
            message: 'KServeUrl was not found!',
        });
    }
}

export { KServeUrlNotFoundError };