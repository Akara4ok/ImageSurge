import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ProjectProcessingController {
    constructor(ProjectProcessingService) {
        this.ProjectProcessingService = ProjectProcessingService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const projectProcessing = await this.ProjectProcessingService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            projectProcessing,
        });
    }

    async create(req, res) {
        const { ProjectId, Processing, Value } = req.body;

        const projectProcessing = await this.ProjectProcessingService.create(
            ProjectId, Processing, Value
        );

        return res.status(HttpStatusCode.CREATED).json({
            projectProcessing
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const projectProcessing = await this.ProjectProcessingService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            projectProcessing,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { ProjectId, Processing, Value } = req.body;

        const projectProcessing = await this.ProjectProcessingService.update(
            id,
            ProjectId, Processing, Value
        );

        return res.status(HttpStatusCode.OK).json({
            projectProcessing,
        });
    }
}

export { ProjectProcessingController };