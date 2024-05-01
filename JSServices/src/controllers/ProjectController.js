import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class ProjectController {
    constructor(ProjectService) {
        this.ProjectService = ProjectService;
    }

    async getAll(req, res) {
        const projects = await this.ProjectService.getAll(req.user?.id);
        return res.status(HttpStatusCode.OK).json({
            projects,
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const project = await this.ProjectService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            project,
        });
    }

    async getKey(req, res) {
        const { id } = req.params;
        const key = await this.ProjectService.getKey(id, req.user?.id);
        return res.status(HttpStatusCode.OK).json({
            key,
        });
    }

    async getFullInfoById(req, res) {
        const { id } = req.params;
        const project = await this.ProjectService.getFullInfoById(id, req.user?.id);
        return res.status(HttpStatusCode.OK).json({
            project,
        });
    }

    async create(req, res) {
        const UserId = req.user?.id;
        const { Name, Cropping, NeuralNetworkName, Datasets, Postprocessings } = req.body;

        const project = await this.ProjectService.create(
            UserId, Name, Cropping, NeuralNetworkName, Datasets, Postprocessings
        );

        return res.status(HttpStatusCode.CREATED).json({
            message: "Start project creating"
        });
    }

    async load(req, res) {
        const UserId = req.user?.id;
        const { id } = req.params;

        const project = await this.ProjectService.load(
            UserId, id
        );

        return res.status(HttpStatusCode.CREATED).json({
            message: "Start project loading"
        });
    }

    async stop(req, res) {
        const UserId = req.user?.id;
        const { id } = req.params;

        const project = await this.ProjectService.stop(
            UserId, id
        );

        return res.status(HttpStatusCode.CREATED).json({
            message: "Start project loading"
        });
    }



    async delete(req, res) {
        const { id } = req.params;

        const project = await this.ProjectService.delete(id, req.user?.id);

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