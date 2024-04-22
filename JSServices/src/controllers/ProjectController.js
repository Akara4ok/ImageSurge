import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ProjectController {
    constructor(ProjectService) {
        this.ProjectService = ProjectService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const project = await this.ProjectService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            project,
        });
    }

    async create(req, res) {
        const { UserId, Status, Name, CreatedAt, Cropping, 
            SecretKey, NeuralNetworkId, CroppingNetworkId, ArtifactPath, level, similarity, Datasets } = req.body;

        const project = await this.ProjectService.create(
            UserId, Status, Name, CreatedAt, Cropping, 
            SecretKey, NeuralNetworkId, CroppingNetworkId, ArtifactPath, level, similarity, Datasets
        );

        return res.status(HttpStatusCode.CREATED).json({
            project
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const project = await this.ProjectService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            project,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { UserId, Status, Name, CreatedAt, Cropping, 
            SecretKey, NeuralNetworkId, CroppingNetworkId, ArtifactPath, level, similarity, Datasets } = req.body;

        const project = await this.ProjectService.update(
            id, UserId, Status, Name, CreatedAt, Cropping, 
            SecretKey, NeuralNetworkId, CroppingNetworkId, ArtifactPath, level, similarity, Datasets
        );

        return res.status(HttpStatusCode.OK).json({
            project,
        });
    }
}

export { ProjectController };