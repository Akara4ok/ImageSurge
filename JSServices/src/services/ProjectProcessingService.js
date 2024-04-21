import { ProjectProcessingNotFoundError } from '../exceptions/ProjectProcessingExceptions.js';
import crypto from 'crypto';

class ProjectProcessingService {
    constructor(ProjectProcessingRepository) {
        this.ProjectProcessingRepository = ProjectProcessingRepository;
    }

    async getById(id) {
        const projectProcessing = await this.ProjectProcessingRepository.getById(id);
        if (!projectProcessing) {
            throw new ProjectProcessingNotFoundError();
        }

        return projectProcessing;
    }

    async create(
        ProjectId, Processing, Value
    ) {
        const id = crypto.randomUUID();
        const projectProcessing = await this.ProjectProcessingRepository.create({
            Id: id,
            ProjectId, Processing, Value
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
            ProjectId, Processing, Value
        });
        return projectProcessing;
    }
}

export { ProjectProcessingService };