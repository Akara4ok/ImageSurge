import { NotFoundError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';

class KServeUrlService {
    constructor(KServeUrlRepository) {
        this.KServeUrlRepository = KServeUrlRepository;
    }

    async getById(id) {
        const kserveUrl = await this.KServeUrlRepository.getById(id);
        if (!kserveUrl) {
            throw new NotFoundError();
        }

        return kserveUrl;
    }

    async create(
        CategoryId, ModelId, UrlSuffix
    ) {
        const id = crypto.randomUUID();
        const kserveUrl = await this.KServeUrlRepository.create({
            Id: id,
            UrlSuffix, Category: { connect: { Id: CategoryId } }, Model: { connect: { Id: ModelId } }
        });
        return kserveUrl;
    }

    async delete(id) {
        const kserveUrl = await this.KServeUrlRepository.delete(id);
        return kserveUrl;
    }

    async update(
        id,
        CategoryId, ModelId, UrlSuffix
    ) {
        const kserveUrl = await this.KServeUrlRepository.update({
            Id: id,
            ModelId, UrlSuffix, Category: { connect: { Id: CategoryId } }
        });
        return kserveUrl;
    }
}

export { KServeUrlService };