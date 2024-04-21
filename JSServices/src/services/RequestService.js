import { RequestNotFoundError } from '../exceptions/RequestExceptions.js';
import crypto from 'crypto';

class RequestService {
    constructor(RequestRepository) {
        this.RequestRepository = RequestRepository;
    }

    async getById(id) {
        const request = await this.RequestRepository.getById(id);
        if (!request) {
            throw new RequestNotFoundError();
        }

        return request;
    }

    async create(
        ProjectId,
        Images,
        ProcessingTime,
        ValidationTime,
        ClassificationTime,
        CroppingTime,
        Quality
    ) {
        const id = crypto.randomUUID();
        const request = await this.RequestRepository.create({
            Id: id,
            ProjectId,
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality
        });
        return request;
    }

    async delete(id) {
        const request = await this.RequestRepository.delete(id);
        return request;
    }

    async update(
        id,
        ProjectId,
        Images,
        ProcessingTime,
        ValidationTime,
        ClassificationTime,
        CroppingTime,
        Quality
    ) {
        const request = await this.RequestRepository.update({
            Id: id,
            ProjectId,
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality
        });
        return request;
    }
}

export { RequestService };