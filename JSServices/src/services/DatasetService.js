import { NotFoundError, ForbiddenError } from '../exceptions/GeneralException.js';
import { DatasetExistsError, DatasetArchiveError, ArchiveSizeError } from '../exceptions/DatasetExceptions.js';
import crypto from 'crypto';
import 'dotenv/config'
import { getDatasetPath, getDockerDatasetPath } from '../utils/utils.js';
import { DataHandler, MIN_IMG } from './DataHandler.js';
import axios from 'axios';
import { existsSync, rmSync } from 'fs';

const PARENT_FOLDER = process.env.PARENT_FOLDER;

class DatasetService {
    constructor(DatasetRepository, CategoryService) {
        this.DatasetRepository = DatasetRepository;
        this.CategoryService = CategoryService;
        this.DataHandler = new DataHandler();
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
            throw new NotFoundError();
        }

        return dataset;
    }

    async create(
        UserId, Name, Category, Source, GDriveLink
    ) {
        const id = crypto.randomUUID();
        const datasetWithName = await this.DatasetRepository.getWithFilter({where: {Name: Name}});
        if(datasetWithName){
            throw new DatasetExistsError();
        }
        const category = await this.CategoryService.getWithFilter({where: {Name: Category}});

        if(Source === 4){
            await this.DataHandler.downloadFile(GDriveLink, getDatasetPath(Name));
        }

        this.DataHandler.checkZipFile(getDatasetPath(Name));
        this.DataHandler.extractAll(getDatasetPath(Name), PARENT_FOLDER, Name)

        const dataset = await this.DatasetRepository.create({
            Id: id,
            Name, ImagesNum: 0, Quality: 0, CreatedAt: new Date(), ParentFolder: PARENT_FOLDER, Source: 2, 
            User: { connect: { Id: UserId } }, Category: { connect: { Id: category.Id } }, Status: "Creating"
        });

        axios({
            url: "http://localhost:5005/validate",
            method:"POST",
            data: {
                path: getDockerDatasetPath(Name),
                name: Name,
                source: 2
            }
        }).then(async response => {
            if(response.data?.result &&  response.data?.result.length > MIN_IMG){
                await this.DatasetRepository.update({
                    Id: id,
                    Name, ImagesNum: response.data?.result.length, Quality: response.data?.quality, CreatedAt: dataset.CreatedAt, ParentFolder: PARENT_FOLDER, Source: 1, 
                    User: { connect: { Id: UserId } }, Category: { connect: { Id: category.Id } }, Status: "Created"
                });
                this.DataHandler.deleteLowQualityImgs(PARENT_FOLDER + "/" + Name, response.data?.result)
            } else {
                throw new ArchiveSizeError(); 
            }
        }).catch(error => {
            console.log(error)
            this.delete(dataset.id, UserId);
        });    

        return dataset;
    }

    async delete(id, requestUserId) {
        const requestDataset = await this.DatasetRepository.getById(id);
        if(!requestUserId || requestUserId !== requestDataset.UserId){
            throw new ForbiddenError();
        }
        const dataset = await this.DatasetRepository.delete(id);
        try{
            if(existsSync(dataset.ParentFolder + "/" + dataset.Name)){
                rmSync(dataset.ParentFolder + "/" + dataset.Name, {recursive: true, force: true});
            }
            if(existsSync(dataset.ParentFolder + "/" + dataset.Name) + ".zip"){
                rmSync(dataset.ParentFolder + "/" + dataset.Name + ".zip", {recursive: true, force: true});
            }
        } catch {}

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