import { NotFoundError, ForbiddenError } from '../exceptions/GeneralException.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import 'dotenv/config'
import { ProjectExistsError, ProjectTrainingError } from '../exceptions/ProjectExceptions.js';
import { ioServer } from '../wssocket/wssocket.js';
import axios from 'axios';
import { existsSync, rmSync } from 'fs';

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ARTIFACT_PATH = process.env.ARTIFACT_PATH;
const EXPERIMENT = process.env.EXPERIMENT;
const DATA_PATH = process.env.DATA_PATH;
const KSERVE_URL = process.env.KSERVE_URL;

class ProjectService {
    constructor(ProjectRepository, DatasetService, NeuralNetworkService, ModelService, CategoryService) {
        this.ProjectRepository = ProjectRepository;
        this.DatasetService = DatasetService;
        this.NeuralNetworkService = NeuralNetworkService;
        this.ModelService = ModelService;
        this.CategoryService = CategoryService;
    }

    async getAll(userId) {
        if(!userId){
            return await this.ProjectRepository.getAll();
        }
        return await this.ProjectRepository.getAll({where: {UserId: userId}});;
    }

    async getById(id) {
        const project = await this.ProjectRepository.getById(id);
        if (!project) {
            throw new NotFoundError();
        }

        return project;
    }

    async create(
        UserId, Name, Cropping, NeuralNetworkName, Datasets, Postprocessings
    ) {
        const id = crypto.randomUUID();

        const projectWithName = await this.ProjectRepository.getWithFilter({where: {UserId: UserId, Name: Name}});
        if(projectWithName){
            throw new ProjectExistsError();
        }

        if(!Datasets && Datasets.length === 0){
            throw new NotFoundError("Dataset");
        }

        const categoryId = (await this.DatasetService.getById(Datasets[0])).categoryId;
        const model = await this.ModelService.getByName(NeuralNetworkName);
        const NeuralNetwork = await this.NeuralNetworkService.getBestNetwork(categoryId, model.Id); 
        
        let modelCropping;
        let CroppingNetwork
        if(Cropping){
            modelCropping = await this.ModelService.getByName("ResNet");
            CroppingNetwork = await this.NeuralNetworkService.getBestNetwork(categoryId, modelCropping.Id); 
        }
        
        const SecretKey = "Bearer " + jwt.sign({ id: UserId }, SECRET_KEY);

        const project = await this.ProjectRepository.create({
            Id: id,
            Status: "Creating", Name, CreatedAt: new Date(), Cropping, SecretKey, ArtifactPath: ARTIFACT_PATH, 
            User: {connect: {Id: UserId}}, 
            NeuralNetwork: {connect: {Id: NeuralNetwork.Id}},
            CroppingNetwork: CroppingNetwork ? {connect: {Id: CroppingNetwork.Id}} : undefined,
            Datasets: {connect: Datasets.map(id => {return { Id: id } })},
            ProjectProcessings: {
                create: Postprocessings.map(value => {
                return {Id: crypto.randomUUID(), Value: value}
                })
            }
        });

        const datasetList = await Promise.all(Datasets.map(async id => { return await this.DatasetService.getById(id)}));

        axios({
            url: "http://localhost:5000/train",
            method:"POST",
            data: {
                user: UserId,
                project: id,
                experiment: EXPERIMENT,
                model_name: NeuralNetworkName,
                cropping: Cropping,
                "data-path": datasetList.map(dataset => DATA_PATH),
                "dataset-names": datasetList.map(dataset => dataset.Name),
                sources: datasetList.map(dataset => dataset.Source),
                "category": (await this.CategoryService.getById(categoryId)).Name,
                "kserve-path-classification": NeuralNetwork.KservePath ? KSERVE_URL + NeuralNetwork.KservePath : undefined,
                "kserve-path-crop": NeuralNetwork.KservePath ? KSERVE_URL + NeuralNetwork.KservePath : undefined,
                "local-kserve": NeuralNetwork.LocalKserve
            }
        }).then(async response => {
            await this.ProjectRepository.update({
                Id: id,
                Status: "Stopped", Name, CreatedAt: project.CreatedAt, Cropping, SecretKey, ArtifactPath: project.ArtifactPath,
                User: { connect: { Id: UserId } },
                NeuralNetwork: { connect: { Id: NeuralNetwork.Id } },
                CroppingNetwork: CroppingNetwork ? { connect: { Id: CroppingNetwork.Id } } : undefined,
            });
            ioServer.sendMessage("project", `created ${Name}`, UserId);
        }).catch(async error => {
            ioServer.sendMessage("project", `Train error`, UserId);
            this.delete(id, UserId);
        });    

        return project;
    }

    async delete(id, requestUserId) {
        const requestProject = await this.ProjectRepository.getById(id);
        if(!requestUserId || requestUserId !== requestProject.UserId){
            throw new ForbiddenError();
        }
        const project = await this.ProjectRepository.delete(id);

        try{
            if(existsSync(project.ArtifactPath + "/" + project.UserId + "/" + project.Id)){
                rmSync(project.ArtifactPath + "/" + project.UserId + "/" + project.Id, {recursive: true, force: true});
            }
        } catch {}

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
            CroppingNetwork: { connect: { Id: CroppingNetworkId } }, Datasets: {connect: Datasets.map(DatasetId => {return { Id: DatasetId } })},
        });
        return project;
    }
}

export { ProjectService };