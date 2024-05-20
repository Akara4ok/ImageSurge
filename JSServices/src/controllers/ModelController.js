import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ModelController {
    constructor(ModelService) {
        this.ModelService = ModelService;
    }

    async getAll(req, res) {
        const models = await this.ModelService.getAll();
        return res.status(HttpStatusCode.OK).json({
            models,
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const model = await this.ModelService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            model,
        });
    }

    async create(req, res) {
        const { Name, Desc } = req.body;

        const model = await this.ModelService.create(
            Name, Desc
        );

        return res.status(HttpStatusCode.CREATED).json({
            model
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const model = await this.ModelService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            model,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { Name, Desc } = req.body;

        const model = await this.ModelService.update(
            id, Name, Desc
        );

        return res.status(HttpStatusCode.OK).json({
            model,
        });
    }
}

export { ModelController };