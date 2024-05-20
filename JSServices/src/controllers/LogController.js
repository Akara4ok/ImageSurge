import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class LogController {
    constructor(LogService) {
        this.LogService = LogService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const log = await this.LogService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            log,
        });
    }

    async getProjectLogs(req, res) {
        const { id } = req.params;
        const logs = await this.LogService.getProjectLogs(id);
        return res.status(HttpStatusCode.OK).json({
            logs,
        });
    }

    async create(req, res) {
        const { ProjectId, StatusCode, Function, Value } = req.body;

        const log = await this.LogService.create(
            ProjectId, StatusCode, Function, Value
        );

        return res.status(HttpStatusCode.CREATED).json({
            log
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const log = await this.LogService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            log,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { ProjectId, Time, StatusCode, Function, Value } = req.body;

        const log = await this.LogService.update(
            id,
            ProjectId, Time, StatusCode, Function, Value
        );

        return res.status(HttpStatusCode.OK).json({
            log,
        });
    }
}

export { LogController };