import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ModelController {
    constructor(ModelService) {
        this.ModelService = ModelService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const model = await this.ModelService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            model,
        });
    }

    async create(req, res) {
        const { Name } = req.body;

        const model = await this.ModelService.create(
            Name
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
        const { Name } = req.body;

        const model = await this.ModelService.update(
            id, Name
        );

        return res.status(HttpStatusCode.OK).json({
            model,
        });
    }
}

export { ModelController };