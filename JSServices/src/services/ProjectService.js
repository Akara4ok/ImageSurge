import { NotFoundError, ForbiddenError } from '../exceptions/GeneralException.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
import 'dotenv/config'
import { ProjectExistsError, ProjectProcessingError, ProjectNotLoadedError } from '../exceptions/ProjectExceptions.js';
import { ioServer } from '../wssocket/wssocket.js';
import axios from 'axios';
import { existsSync, rmSync, stat } from 'fs';
import { HttpError } from '../exceptions/HttpErrors.js';
import { performance } from 'perf_hooks';
import AdmZip from 'adm-zip';
import { PassThrough, Readable } from 'stream';
import fs from 'fs'

const SECRET_KEY = process.env.JWT_SECRET_KEY;
const ARTIFACT_PATH = process.env.ARTIFACT_PATH;
const EXPERIMENT = process.env.EXPERIMENT;
const DATA_PATH = process.env.DATA_PATH;
const KSERVE_URL = process.env.KSERVE_URL;
const DOCKER_FOLDER = process.env.DOCKER_FOLDER;
const KSERVE_URL_CROP = process.env.KSERVE_URL_CROP;

class ProjectService {
    constructor(ProjectRepository, DatasetService, NeuralNetworkService, ModelService, CategoryService, LogService, RequestService, LoadStatService) {
        this.ProjectRepository = ProjectRepository;
        this.DatasetService = DatasetService;
        this.NeuralNetworkService = NeuralNetworkService;
        this.ModelService = ModelService;
        this.CategoryService = CategoryService;
        this.LogService = LogService;
        this.RequestService = RequestService;
        this.LoadStatService = LoadStatService;
        this.loadAll();
    }

    async getAll(userId) {
        if(!userId){
            return await this.ProjectRepository.getAll({orderBy: {CreatedAt: 'desc'}, include: {NeuralNetwork: true, CroppingNetwork: true}});
        }
        return await this.ProjectRepository.getAll({where: {UserId: userId}, orderBy: {CreatedAt: 'desc'}});;
    }

    async getById(id) {
        const project = await this.ProjectRepository.getById(id);
        if (!project) {
            throw new NotFoundError("Project");
        }

        return project;
    }

    async getKey(id, UserId) {
        const project = await this.ProjectRepository.getById(id);
        if (!project) {
            throw new NotFoundError();
        }
        if (project.UserId !== UserId){
            throw new ForbiddenError();
        }

        return project.SecretKey;
    }

    async getFullInfoById(id, UserId) {
        const project = await this.ProjectRepository.getFullInfoById(id);
        delete project.SecretKey;

        if (!project) {
            throw new NotFoundError();
        }

        if(project.UserId != UserId){
            throw new ForbiddenError();
        }

        return project;
    }

    async getProjectLogs(ProjectId, UserId) {
        const project = await this.getById(ProjectId);
        if(project.UserId !== UserId){
            throw new ForbiddenError();
        }
        const logs = await this.LogService.getProjectLogs(ProjectId);
        return logs
    }

    async getProjectStats(ProjectId, UserId) {
        const project = await this.getById(ProjectId);
        if(project.UserId !== UserId){
            throw new ForbiddenError();
        }
        const stats = await this.RequestService.getStatsByProjectId(ProjectId);
        stats.TotalTime = await this.LoadStatService.getProjectWorkingTime(ProjectId);
        return stats;
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
        const NeuralNetwork = await this.NeuralNetworkService.getBestNetwork(categoryId, model.Id, false); 
        
        let modelCropping;
        let CroppingNetwork
        if(Cropping){
            modelCropping = await this.ModelService.getByName("ResNet");
            CroppingNetwork = await this.NeuralNetworkService.getBestNetwork(categoryId, modelCropping.Id, false); 
        }
        
        const SecretKey = jwt.sign({}, SECRET_KEY);

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
                Level: 15,
                "data-path": datasetList.map(dataset => DATA_PATH),
                "dataset-names": datasetList.map(dataset => dataset.Name),
                sources: datasetList.map(dataset => dataset.Source),
                "category": (await this.CategoryService.getById(categoryId)).Name,
                "kserve-path-classification": NeuralNetwork.KservePath ? KSERVE_URL + NeuralNetwork.KservePath : undefined,
                "kserve-path-crop": CroppingNetwork?.KservePath ? KSERVE_URL + CroppingNetwork.KservePath : undefined,
                "local-kserve": NeuralNetwork.LocalKserve
            }
        }).then(async response => {
            await this.ProjectRepository.update({
                Id: id,
                Status: "Stopped"
            });
            ioServer.sendMessage("project", `created ${Name}`, UserId);
        }).catch(async error => {
            ioServer.sendMessage("project", `Train error`, UserId);
            this.delete(id, UserId);
        });    

        return project;
    }

    async load(UserId, ProjectId, onStartup=false){
        let project;
        try{
            project = await this.getFullInfoById(ProjectId, UserId);
        } catch (error){
            if(error instanceof HttpError){
                await this.LogService.create(ProjectId, error.response.status, "Load", error.message, project?.UserId ?? UserId);
            }
            throw error
        }

        return await this.loadProject(project)
    }

    async loadProject(project, onStartup = false){
        let CroppingNetwork
        if(project.Cropping){
            const modelCropping = await this.ModelService.getByName("ResNet");
            CroppingNetwork = await this.NeuralNetworkService.getBestNetwork(project.CategoryId, modelCropping.Id, true); 
        }
        
        if(!onStartup){
            ioServer.sendMessage("project", `Start loading ${project.Name}`, project.UserId);
            await this.ProjectRepository.update({
                Id: project.Id,
                Status: "Loading"
            });
        }
        

        axios({
            url: "http://localhost:5000/load",
            method:"POST",
            data: {
                user: project.UserId,
                project: project.Id,
                experiment: EXPERIMENT,
                cropping: project.Cropping,
                "kserve-path-classification": project.NeuralNetwork.KservePath ? KSERVE_URL + project.NeuralNetwork.KservePath : undefined,
                "kserve-path-crop": project.CroppingNetwork?.KservePath ? KSERVE_URL + CroppingNetwork.KservePath : undefined,
                "local-kserve": project.NeuralNetwork.LocalKserve
            }
        }).then(async response => {
            if(onStartup){
                return project;
            }

            await this.ProjectRepository.update({
                Id: project.Id,
                Status: "Running"
            });
            await this.LoadStatService.create(project.Id, new Date());
            
            await this.LogService.create(project.Id, 200, "Load", "Success", project.UserId);

            ioServer.sendMessage("project", `loaded ${project.Name}`, project.UserId);
        }).catch(async error => {
            await this.ProjectRepository.update({
                Id: project.Id,
                Status: "Stopped"
            });

            if(onStartup){
                return project;
            }

            await this.LogService.create(project.Id, error.response.status, "Load", error.response?.data?.message ?? "Load Failed", project?.UserId ?? UserId);

            ioServer.sendMessage("project", `Load error`, project.UserId);
        });    

        return project;
    }

    async loadAll(){
        let projects;
        try{
            projects = await this.getAll();
        } catch (error){
            return;
        }
        for (let index = 0; index < projects.length; index++) {
            const element = projects[index];
            if(element.Status === "Running"){
                this.loadProject(element, true);
            }
        }
    }

    async stop(UserId, ProjectId){
        let project;
        try{
            project = await this.getFullInfoById(ProjectId, UserId);
        } catch (error){
            if(error instanceof HttpError){
                await this.LogService.create(ProjectId, error.response.status, "Stop", error.message, project?.UserId ?? UserId);
            }
            throw error
        }
        
        try{
            const response = await axios({
                url: "http://localhost:5000/stop",
                method:"POST",
                data: {
                    user: UserId,
                    project: ProjectId,
                    experiment: EXPERIMENT,
                    cropping: project.Cropping,
                }
            })

            await this.ProjectRepository.update({
                Id: ProjectId,
                Status: "Stopped"
            });

            await this.LoadStatService.updateLastLoaded(project.Id, new Date());

            await this.LogService.create(ProjectId, 200, "Stop", "Success", project?.UserId ?? UserId);

        } catch(error) {
            // console.log(error);
            await this.LogService.create(ProjectId, error.response.status, "Stop", error.response?.data?.message ?? "Load Failed", project?.UserId ?? UserId);
            if(error.response?.data?.message === "inferences not loaded"){
                ioServer.sendMessage("project", `Stop failed`, UserId);
                await this.ProjectRepository.update({
                    Id: ProjectId,
                    Status: "Stopped"
                });
                await this.LoadStatService.create(project.Id, new Date());
                return project;
            }
            await this.ProjectRepository.update({
                Id: ProjectId,
                Status: "Running"
            });
        }
        
        ioServer.sendMessage("project", `Stop occured`, UserId);
        return project;
    }

    async process(email, name, secretKey, files){
        const project = await this.ProjectRepository.getProjectWithProcessingByName(email, name);
        if (!project) {
            throw new NotFoundError("Project or User");
        }
        if(project.Status !== "Running"){
            await this.LogService.create(project.Id, 400, "Process", "Project not loaded", project?.UserId ?? UserId);
            throw new ProjectNotLoadedError();
        }
        if(project.SecretKey != secretKey){
            await this.LogService.create(project.Id, 403, "Process", "Access denied", project?.UserId ?? UserId);
            throw new ForbiddenError();
        }
        
        try{
            let processTime = performance.now();
            const formData = new FormData();
            formData.append('user', project.UserId);
            formData.append('project', project.Id);
            formData.append('experiment', EXPERIMENT);
            formData.append('cropping', project.Cropping ? "True" : "False");
            formData.append('level', project.Level);
            if(project.Similarity){
                formData.append('similarity', project.Similarity);
            }
            formData.append('postprocessing', "[" + project.ProjectProcessings.map(processing => {return '"' + processing.Value + '"'; }) + "]");

            files.forEach(file => {
                formData.append('file', new Blob([file.buffer], {type: file.mimetype}), file.originalname)
            });

            const response = await axios({
                url: "http://localhost:5000/process",
                method: "post",
                data: formData,
                responseType: 'stream'
            });
            processTime = (performance.now() - processTime) / 1000;
            
            let buffers = [];
            for await (const chunk of response.data) {
                buffers.push(chunk);
            }
            const bufferedData = Buffer.concat(buffers);

            const zip = new AdmZip(bufferedData);
            const metainfo = JSON.parse(zip.readAsText("metainfo.json"));
            
            await this.RequestService.create(project.Id, files.length, processTime, 
                metainfo?.validation_time ?? 0, 
                metainfo?.classification_time ?? 0, 
                metainfo?.cropping_time ?? 0,
                metainfo?.quality?.reduce((a, b) => a + b, 0) ?? 0
                );
                
            await this.LogService.create(project.Id, 200, "Process", "Processed " + files.length + " images", project?.UserId ?? UserId);
            return Readable.from(bufferedData);
        } catch(error) {
            console.log(error)
            await this.LogService.create(project.Id, error.response?.status ?? 500, "Process", error.response?.data ?? "Process Failed", project?.UserId ?? UserId);
            throw new ProjectProcessingError();
        }        
    }

    async getFilePath(filename, datasets){
        for (let index = 0; index < datasets.length; index++) {
            const dataset = datasets[index];
            try{
                if(existsSync(dataset.ParentFolder + "/" + dataset.Name + "/" + filename)){
                    return dataset.ParentFolder + "/" + dataset.Name + "/" + filename;
                }
            } catch {}
        }
    }

    async getImage(id, userId, filename) {
        const project = await this.getFullInfoById(id, userId);
        
        if(project.Status !== "Running"){
            throw new ProjectNotLoadedError();
        }

        const imagePath = await this.getFilePath(filename, project.Datasets)
        return new Promise((resolve, reject) => {
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    reject('Image not found');
                } else {
                    resolve(Readable.from(data));
                }
            });
        });
    }
    

    async croptuneStart(id, userId){
        const project = await this.getFullInfoById(id, userId);
        if(project.Status !== "Running"){
            throw new ProjectNotLoadedError();
        }
        
        try{
            return await axios({
                url: "http://localhost:5000/croptunestart",
                method: "post",
                data: {
                    user: userId,
                    project: id,
                    experiment: "project",
                    datasets: project.Datasets.map(dataset => DOCKER_FOLDER + dataset.Name),
                    count: 5
                },
            });
        } catch(error) {
            console.log(error.response.data)
            throw new ProjectProcessingError();
        }        
    }

    async croptuneTest(id, userId, level, similarity){
        const project = await this.getFullInfoById(id, userId);
        if(project.Status !== "Running"){
            throw new ProjectNotLoadedError();
        }
        
        try{
            return await axios({
                url: "http://localhost:5000/croptunetest",
                method: "post",
                data: {
                    user: userId,
                    project: id,
                    experiment: "project",
                    level: level,
                    similarity: similarity
                },
            });
        } catch(error) {
            console.log(error.response.data)
            throw new ProjectProcessingError();
        }        
    }

    async croptuneStop(id, userId){
        const project = await this.getFullInfoById(id, userId);
        if(project.Status !== "Running"){
            throw new ProjectNotLoadedError();
        }
        
        try{
            return await axios({
                url: "http://localhost:5000/croptunestop",
                method: "post",
                data: {
                    user: userId,
                    project: id,
                    experiment: "project",
                },
            });
        } catch(error) {
            console.log(error.response.data)
            throw new ProjectProcessingError();
        }        
    }

    async cropInfo(id, userId){
        const project = await this.getFullInfoById(id, userId);
        if(project.Status !== "Running"){
            throw new ProjectNotLoadedError();
        }
        
        return {
            level: project.Level,
            similarity: project.Similarity
        }
    }

    async delete(id, requestUserId) {
        const requestProject = await this.ProjectRepository.getById(id);
        if(!requestUserId || requestUserId !== requestProject.UserId){
            throw new ForbiddenError();
        }
        if(requestProject.Status === "Running"){
            await this.stop(requestUserId, id);
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
        id, UserId, Level, Similarity
    ) {
        const requestProject = await this.ProjectRepository.getById(id);
        if(!UserId || UserId !== requestProject?.UserId){
            throw new ForbiddenError();
        }
        const project = await this.ProjectRepository.update({
            Id: id, Level, Similarity, 
        });
        await this.LogService.create(project.Id, 200, "Update", "New level: " + Level + " new simialirity: " + Similarity, project?.UserId ?? UserId);
        return project;
    }
}

export { ProjectService };