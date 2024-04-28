import { NotFoundError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';

class ModelService {
    constructor(ModelRepository) {
        this.ModelRepository = ModelRepository;
    }

    async getById(id) {
        const model = await this.ModelRepository.getById(id);
        if (!model) {
            throw new NotFoundError();
        }

        return model;
    }

    async create(
        Name
    ) {
        const id = crypto.randomUUID();
        const model = await this.ModelRepository.create({
            Id: id,
            Name
        });
        return model;
    }

    async delete(id) {
        const model = await this.ModelRepository.delete(id);
        return model;
    }

    async update(
        id,
        Name
    ) {
        const model = await this.ModelRepository.update({
            Id: id,
            Name
        });
        return model;
    }
}

export { ModelService };