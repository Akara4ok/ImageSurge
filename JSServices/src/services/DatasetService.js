import { NotFoundError, ForbiddenError } from '../exceptions/GeneralException.js';
import { DatasetExistsError, DatasetArchiveError, ArchiveSizeError } from '../exceptions/DatasetExceptions.js';
import crypto from 'crypto';
import 'dotenv/config'
import AdmZip from 'adm-zip';
import { getDatasetPath } from '../utils/utils.js';
import { DataHandler } from './DataHandler.js';
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

        if(Source === 1){
            this.DataHandler.checkZipFile(getDatasetPath(Name));
        } else if(Source === 4){
            await this.DataHandler.downloadFile(GDriveLink, getDatasetPath(Name));
            this.DataHandler.checkZipFile(getDatasetPath(Name));
        }

        this.checkZipFile(getDatasetPath(Name));

        const dataset = await this.DatasetRepository.create({
            Id: id,
            Name, ImagesNum: 0, Quality: 0, CreatedAt: new Date(), ParentFolder: PARENT_FOLDER, Source: 1, 
            User: { connect: { Id: UserId } }, Category: { connect: { Id: category.Id } }, Status: "Creating"
        });
        return dataset;
    }

    async delete(id, requestUserId) {
        const requestDataset = await this.DatasetRepository.getById(id);
        if(!requestUserId || requestUserId !== requestDataset.UserId){
            throw new ForbiddenError();
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