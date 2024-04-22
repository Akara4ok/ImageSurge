import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class KServeUrlController {
    constructor(KServeUrlService) {
        this.KServeUrlService = KServeUrlService;
    }

    async getById(req, res) {
        const { id } = req.params;
        const kserveUrl = await this.KServeUrlService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            kserveUrl,
        });
    }

    async create(req, res) {
        const { CategoryId, ModelId, UrlSuffix } = req.body;

        const kserveUrl = await this.KServeUrlService.create(
            CategoryId, ModelId, UrlSuffix
        );

        return res.status(HttpStatusCode.CREATED).json({
            kserveUrl
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const kserveUrl = await this.KServeUrlService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            kserveUrl,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { CategoryId, ModelNameId, UrlSuffix } = req.body;

        const kserveUrl = await this.KServeUrlService.update(
            id, CategoryId, ModelNameId, UrlSuffix
        );

        return res.status(HttpStatusCode.OK).json({
            kserveUrl,
        });
    }
}

export { KServeUrlController };