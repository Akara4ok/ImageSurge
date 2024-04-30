import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class DatasetExistsError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.FORBIDDEN,
            message: 'Dataset with this name exists',
        });
    }
}

class DatasetArchiveError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.BAD_REQUEST,
            message: 'Archive is invalid or corrupted',
        });
    }
}

class ArchiveSizeError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.BAD_REQUEST,
            message: 'Too small or too large number of images',
        });
    }
}

class GDriveLoadingError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.BAD_REQUEST,
            message: 'Error caused gdrive file',
        });
    }
}

export { DatasetExistsError, DatasetArchiveError, ArchiveSizeError, GDriveLoadingError };