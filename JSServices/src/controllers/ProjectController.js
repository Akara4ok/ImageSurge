import { HttpStatusCode } from '../constants/enums/StatusCodes.js';
import { Readable } from 'stream';
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

    async getProjectLogs(req, res) {
        const { id } = req.params;
        const logs = await this.ProjectService.getProjectLogs(id, req.user?.id);
        return res.status(HttpStatusCode.OK).json({
            logs,
        });
    }

    async getProjectStats(req, res) {
        const { id } = req.params;
        const stats = await this.ProjectService.getProjectStats(id, req.user?.id);
        return res.status(HttpStatusCode.OK).json({
            stats,
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

    async process(req, res) {
        const { email, name, secretKey } = req.body;
        const files = req.files;

        const stream = await this.ProjectService.process(
            email, name, secretKey, files
        );

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=result.zip");

        stream?.pipe(res);
        const waitPipe = res => new Promise(resolve => stream.on("finish", resolve));
        await waitPipe();
    }

    async croptuneStart(req, res) {
        const { id } = req.params;

        const response = await this.ProjectService.croptuneStart(id, req.user?.id);

        return res.status(HttpStatusCode.OK).json(response.data);
    }

    async croptuneTest(req, res) {
        const { id, level, similarity } = req.params;

        const response = await this.ProjectService.croptuneTest(id, req.user?.id, level, similarity);

        return res.status(HttpStatusCode.OK).json(response.data);
    }

    async croptuneStop(req, res) {
        const { id } = req.params;

        const response = await this.ProjectService.croptuneStop(id, req.user?.id);

        return res.status(HttpStatusCode.OK).json(response.data);
    }

    async cropInfo(req, res) {
        const { id } = req.params;

        const result = await this.ProjectService.cropInfo(id, req.user?.id);

        return res.status(HttpStatusCode.OK).json(result);
    }

    async getImage(req, res) {
        const { id } = req.params;
        const { filename } = req.params;
        const imageData = await this.ProjectService.getImage(id, req.user?.id, filename);
        res.setHeader("Content-Type", "image/jpeg");
        imageData?.pipe(res);
        const waitPipe = res => new Promise(resolve => imageData.on("finish", resolve));
        await waitPipe();
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
        const { level, similarity } = req.body;
        
        const project = await this.ProjectService.update(id, req.user?.id, level, similarity);

        return res.status(HttpStatusCode.OK).json({
            project,
        });
    }
}

export { ProjectController };