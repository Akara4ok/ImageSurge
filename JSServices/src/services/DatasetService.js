import { DatasetNotFoundError, DatasetForbiddenError } from '../exceptions/DatasetExceptions.js';
import crypto from 'crypto';

class DatasetService {
    constructor(DatasetRepository) {
        this.DatasetRepository = DatasetRepository;
    }

    async getAll(userId) {
        if(!userId){
            return await this.DatasetRepository.getAll();
        }
        return await this.DatasetRepository.getAll({where: {UserId: userId}, include: {Category: true}});;
    }

    async getById(id) {
        const dataset = await this.DatasetRepository.getById(id);
        if (!dataset) {
            throw new DatasetNotFoundError();
        }

        return dataset;
    }

    async create(
        UserId, Name, ImagesNum, CategoryId, CreatedAt, ParentFolder, Source
    ) {
        const id = crypto.randomUUID();
        const dataset = await this.DatasetRepository.create({
            Id: id,
            Name, ImagesNum, CreatedAt: CreatedAt ? CreatedAt : new Date(), ParentFolder, Source, 
            User: { connect: { Id: UserId } }, Category: { connect: { Id: CategoryId } }
        });
        return dataset;
    }

    async delete(id, requestUserId) {
        const requestDataset = await this.DatasetRepository.getById(id);
        if(!requestUserId || requestUserId !== requestDataset.UserId){
            throw new DatasetForbiddenError();
        }
        const dataset = await this.DatasetRepository.delete(id);
        return dataset;
    }

    async update(
        id,
        Name
    ) {
        const dataset = await this.DatasetRepository.update({
            Id: id,
            Name, ImagesNum, CreatedAt, ParentFolder, Source, 
            User: { connect: { Id: UserId } }, Category: { connect: { Id: CategoryId } }
        });
        return dataset;
    }
}

export { DatasetService };