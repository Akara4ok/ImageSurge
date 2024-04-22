import { HttpError } from './HttpErrors.js';
import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class NeuralNetworkNotFoundError extends HttpError {
    constructor() {
        super({
            status: HttpStatusCode.NOT_FOUND,
            message: 'NeuralNetwork was not found!',
        });
    }
}

export { NeuralNetworkNotFoundError };