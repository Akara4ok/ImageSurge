import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class RequestController {
    constructor(RequestService) {
        this.RequestService = RequestService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const request = await this.RequestService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            request,
        });
    }

    async create(req, res) {
        const { 
            ProjectId,
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality
         } = req.body;

        const request = await this.RequestService.create(
            ProjectId,
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality
        );

        return res.status(HttpStatusCode.CREATED).json({
            request
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const request = await this.RequestService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            request,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { 
            ProjectId,
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality
        } = req.body;

        const request = await this.RequestService.update(
            id,
            ProjectId,
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality
        );

        return res.status(HttpStatusCode.OK).json({
            request,
        });
    }
}

export { RequestController };