import { NotFoundError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';

class ProjectProcessingService {
    constructor(ProjectProcessingRepository) {
        this.ProjectProcessingRepository = ProjectProcessingRepository;
    }

    async getById(id) {
        const projectProcessing = await this.ProjectProcessingRepository.getById(id);
        if (!projectProcessing) {
            throw new NotFoundError();
        }

        return projectProcessing;
    }

    async create(
        ProjectId, Processing, Value
    ) {
        const id = crypto.randomUUID();
        const projectProcessing = await this.ProjectProcessingRepository.create({
            Id: id,
            Processing, Value, Project: { connect: { Id: ProjectId } }
        });
        return projectProcessing;
    }

    async delete(id) {
        const projectProcessing = await this.ProjectProcessingRepository.delete(id);
        return projectProcessing;
    }

    async update(
        id,
        ProjectId, Processing, Value
    ) {
        const projectProcessing = await this.ProjectProcessingRepository.update({
            Id: id,
            Processing, Value, Project: { connect: { Id: ProjectId } }
        });
        return projectProcessing;
    }
}

export { ProjectProcessingService };