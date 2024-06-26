import { NotFoundError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';

class ModelService {
    constructor(ModelRepository) {
        this.ModelRepository = ModelRepository;
    }

    async getAll() {
        const models = await this.ModelRepository.getAll();
        return models;
    }

    async getById(id) {
        const model = await this.ModelRepository.getById(id);
        if (!model) {
            throw new NotFoundError("Model");
        }

        return model;
    }

    async getByName(name) {
        const model = await this.ModelRepository.getByName(name);
        if (!model) {
            throw new NotFoundError("Model");
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