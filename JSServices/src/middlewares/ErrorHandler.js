import { HttpStatusCode } from '../constants/enums/StatusCodes.js';
import { HttpError } from '../exceptions/HttpErrors.js';

export const errorHandler = (
    err,
    req,
    res,
    next,
) => {
    if (!err) {
        next();
    }

    console.error(err);

    if (err instanceof HttpError) {
        return res.status(err.status).json({
            error: err.message,
        });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: 'Internal sever error!',
    });
};