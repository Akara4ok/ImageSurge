import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

export const wrap = (
    handler
) =>
    (
        req,
        res,
        next,
    ) =>
        handler(req, res)
            .then((result) => {
                if (!result) {
                    return res.status(HttpStatusCode.OK).json({
                        success: true,
                    });
                }

                return res;
            })
            .catch(next);