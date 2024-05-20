import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class LoadStatController {
    constructor(LoadStatService) {
        this.LoadStatService = LoadStatService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const loadStat = await this.LoadStatService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            loadStat,
        });
    }

    async getProjectLoadStats(req, res) {
        const { id } = req.params;
        const loadStats = await this.LoadStatService.getProjectLoadStats(id);
        return res.status(HttpStatusCode.OK).json({
            loadStats,
        });
    }

    async create(req, res) {
        const { ProjectId, LoadTime, StopTime } = req.body;

        const loadStat = await this.LoadStatService.create(
            ProjectId, LoadTime, StopTime
        );

        return res.status(HttpStatusCode.CREATED).json({
            loadStat
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const loadStat = await this.LoadStatService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            loadStat,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { ProjectId, LoadTime, StopTime } = req.body;

        const loadStat = await this.LoadStatService.update(
            id,
            ProjectId, LoadTime, StopTime
        );

        return res.status(HttpStatusCode.OK).json({
            loadStat,
        });
    }
}

export { LoadStatController };