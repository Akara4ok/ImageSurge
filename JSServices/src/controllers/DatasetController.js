import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class DatasetController {
    constructor(DatasetService) {
        this.DatasetService = DatasetService;
        
    }

    async getAll(req, res) {
        const datasets = await this.DatasetService.getAll(req.user?.id);
        return res.status(HttpStatusCode.OK).json({
            datasets,
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const dataset = await this.DatasetService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            dataset,
        });
    }

    async create(req, res) {
        const UserId = req.user?.id;
        const { Name, Category, Source, GDriveLink  } = req.body;

        const dataset = await this.DatasetService.create(
            UserId, Name, Category, parseInt(Source), GDriveLink
        );

        return res.status(HttpStatusCode.CREATED).json({
            message: "Start dataset creating"
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const dataset = await this.DatasetService.delete(id, req.user?.id);

        return res.status(HttpStatusCode.OK).json({
            dataset,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { UserId, Name, ImagesNum, CategoryId, CreatedAt, ParentFolder, Source } = req.body;

        const dataset = await this.DatasetService.update(
            id, UserId, Name, ImagesNum, CategoryId, CreatedAt, ParentFolder, Source
        );

        return res.status(HttpStatusCode.OK).json({
            dataset,
        });
    }
}

export { DatasetController };