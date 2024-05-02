import { NotFoundError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';

class RequestService {
    constructor(RequestRepository) {
        this.RequestRepository = RequestRepository;
    }

    async getById(id) {
        const request = await this.RequestRepository.getById(id);
        if (!request) {
            throw new NotFoundError();
        }

        return request;
    }

    async getStatsByProjectId(id) {
        const stat = await this.RequestRepository.getStatsByProjectId(id);
        if (!stat) {
            return {
              TotalRequests: 0,
              Images: 0,
              ProcessingTime: 0,
              ValidationTime: 0,
              ClassificationTime: 0,
              CroppingTime: 0,
              Quality: 0,
            };
        }
        return stat;
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
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality,
            Project: { connect: { Id: ProjectId } }
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
            Images,
            ProcessingTime,
            ValidationTime,
            ClassificationTime,
            CroppingTime,
            Quality,
            Project: { connect: { Id: ProjectId } }
        });
        return request;
    }
}

export { RequestService };