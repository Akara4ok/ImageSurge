import { NeuralNetworkNotFoundError } from '../exceptions/NeuralNetworkExceptions.js';
import crypto from 'crypto';

class NeuralNetworkService {
    constructor(NeuralNetworkRepository) {
        this.NeuralNetworkRepository = NeuralNetworkRepository;
    }

    async getById(id) {
        const neuralNetwork = await this.NeuralNetworkRepository.getById(id);
        if (!neuralNetwork) {
            throw new NeuralNetworkNotFoundError();
        }

        return neuralNetwork;
    }

    async create(
        CategoryId, KservePath, LocalKserve, ModelId
    ) {
        const id = crypto.randomUUID();
        const neuralNetwork = await this.NeuralNetworkRepository.create({
            Id: id,
            KservePath, LocalKserve, Category: { connect: { Id: CategoryId } }, Model: { connect: { Id: ModelId } }
        });
        return neuralNetwork;
    }

    async delete(id) {
        const neuralNetwork = await this.NeuralNetworkRepository.delete(id);
        return neuralNetwork;
    }

    async update(
        id,
        CategoryId, KservePath, LocalKserve, ModelId
    ) {
        const neuralNetwork = await this.NeuralNetworkRepository.update({
            Id: id,
            KservePath, LocalKserve, Category: { connect: { Id: CategoryId } }, Model: { connect: { Id: ModelId } }
        });
        return neuralNetwork;
    }
}

export { NeuralNetworkService };