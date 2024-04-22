import { ProjectNotFoundError } from '../exceptions/ProjectExceptions.js';
import crypto from 'crypto';

class ProjectService {
    constructor(ProjectRepository) {
        this.ProjectRepository = ProjectRepository;
    }

    async getById(id) {
        const project = await this.ProjectRepository.getById(id);
        if (!project) {
            throw new ProjectNotFoundError();
        }

        return project;
    }

    async create(
        UserId, Status, Name, CreatedAt, Cropping, 
            SecretKey, NeuralNetworkId, CroppingNetworkId, ArtifactPath, Level, Similarity, Datasets
    ) {
        const id = crypto.randomUUID();
        const project = await this.ProjectRepository.create({
            Id: id,
            Status, Name, CreatedAt: CreatedAt ? CreatedAt : new Date(), Cropping, SecretKey, ArtifactPath, Level, Similarity, 
            User: { connect: { Id: UserId } }, NeuralNetwork: { connect: { Id: NeuralNetworkId } }, 
            CroppingNetwork: { connect: { Id: CroppingNetworkId } }, Datasets: {connect: Datasets.map(DatasetId => {return { Id: DatasetId } })}
        });
        return project;
    }

    async delete(id) {
        const project = await this.ProjectRepository.delete(id);
        return project;
    }

    async update(
        id,
        UserId, Status, Name, CreatedAt, Cropping, 
            SecretKey, NeuralNetworkId, CroppingNetworkId, ArtifactPath, Level, Similarity, Datasets
    ) {
        const project = await this.ProjectRepository.update({
            Id: id,
            Status, Name, CreatedAt: CreatedAt ? CreatedAt : new Date(), Cropping, SecretKey, ArtifactPath, Level, Similarity, 
            User: { connect: { Id: UserId } }, NeuralNetwork: { connect: { Id: NeuralNetworkId } }, 
            CroppingNetwork: { connect: { Id: CroppingNetworkId } }, Datasets: {connect: Datasets.map(DatasetId => {return { Id: DatasetId } })}
        });
        return project;
    }
}

export { ProjectService };