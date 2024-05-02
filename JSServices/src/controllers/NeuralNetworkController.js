import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class NeuralNetworkController {
    constructor(NeuralNetworkService) {
        this.NeuralNetworkService = NeuralNetworkService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const neuralNetwork = await this.NeuralNetworkService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            neuralNetwork,
        });
    }

    async create(req, res) {
        const { CategoryId, KservePath, LocalKserve, ModelId, CropInference } = req.body;

        const neuralNetwork = await this.NeuralNetworkService.create(
            CategoryId, KservePath, LocalKserve, ModelId, CropInference
        );

        return res.status(HttpStatusCode.CREATED).json({
            neuralNetwork
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const neuralNetwork = await this.NeuralNetworkService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            neuralNetwork,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { CategoryId, KservePath, LocalKserve, ModelId, CropInference } = req.body;

        const neuralNetwork = await this.NeuralNetworkService.update(
            id, CategoryId, KservePath, LocalKserve, ModelId, CropInference
        );

        return res.status(HttpStatusCode.OK).json({
            neuralNetwork,
        });
    }
}

export { NeuralNetworkController };