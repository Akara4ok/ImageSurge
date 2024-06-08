import { NotFoundError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';

class NeuralNetworkService {
    constructor(NeuralNetworkRepository) {
        this.NeuralNetworkRepository = NeuralNetworkRepository;
    }

    async getById(id) {
        const neuralNetwork = await this.NeuralNetworkRepository.getById(id);
        if (!neuralNetwork) {
            throw new NotFoundError();
        }

        return neuralNetwork;
    }

    async getBestNetwork(categoryId, modelId, Crop){
        const relatedNetworks = await this.NeuralNetworkRepository.getRelatedNetworks(categoryId, modelId);
        if (!relatedNetworks || relatedNetworks.length === 0) {
            throw new NotFoundError("NeuralNetworks");
        }
        let localKserveNetwork;
        let nonKserveNetwork;
        for (let index = 0; index < relatedNetworks.length; index++) {
            const element = relatedNetworks[index];
            if(!element.KservePath && element.CropInference === Crop && element.Working){
                nonKserveNetwork = element;
            }
            if(!localKserveNetwork && element.LocalKserve && element.KservePath && element.CropInference === Crop && element.Working){
                localKserveNetwork = element;
            }
            if(!element.LocalKserve && element.KservePath && element.CropInference === Crop && element.Working){
                return element
            }
        }
        if(localKserveNetwork){
            return localKserveNetwork;
        }
        return nonKserveNetwork;
    }

    async create(
        CategoryId, KservePath, LocalKserve, ModelId, CropInference
    ) {
        const id = crypto.randomUUID();
        const neuralNetwork = await this.NeuralNetworkRepository.create({
            Id: id,
            KservePath, LocalKserve, CropInference, Category: { connect: { Id: CategoryId } }, Model: { connect: { Id: ModelId } }
        });
        return neuralNetwork;
    }

    async delete(id) {
        const neuralNetwork = await this.NeuralNetworkRepository.delete(id);
        return neuralNetwork;
    }

    async update(
        id,
        CategoryId, KservePath, LocalKserve, ModelId, CropInference
    ) {
        const neuralNetwork = await this.NeuralNetworkRepository.update({
            Id: id,
            KservePath, LocalKserve, CropInference, Category: { connect: { Id: CategoryId } }, Model: { connect: { Id: ModelId } }
        });
        return neuralNetwork;
    }
}

export { NeuralNetworkService };