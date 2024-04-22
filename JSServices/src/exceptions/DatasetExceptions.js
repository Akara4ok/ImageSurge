import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class DatasetNotFoundError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.NOT_FOUND,
            message: 'Dataset was not found!',
        });
    }
}

export { DatasetNotFoundError };