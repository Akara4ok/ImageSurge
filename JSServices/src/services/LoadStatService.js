import { NotFoundError } from '../exceptions/GeneralException.js';
import { ioServer } from '../wssocket/wssocket.js';
import crypto from 'crypto';

class LoadStatService {
    constructor(LoadStatRepository) {
        this.LoadStatRepository = LoadStatRepository;
    }

    async getById(id) {
        const loadStat = await this.LoadStatRepository.getById(id);
        if (!loadStat) {
            throw new NotFoundError();
        }

        return loadStat;
    }

    async getLastLoaded(id) {
        const loadStat = await this.LoadStatRepository.getLastLoaded(id);
        if (!loadStat) {
            throw new NotFoundError("Load statistics");
        }

        return loadStat;
    }

    async getProjectWorkingTime(ProjectId) {
        const loadStats = await this.LoadStatRepository.getAllByProjectId(ProjectId);
        let sum = loadStats.reduce((total, { LoadTime, StopTime }) => {
            const loadDate = new Date(LoadTime);
            if(!StopTime){
                return total;
            }
            const stopDate = new Date(StopTime);
            const differenceInSeconds = (stopDate.getTime() - loadDate.getTime()) / 1000;
            return total + differenceInSeconds;
          }, 0);
        const lastLoaded = await this.getLastLoaded(ProjectId);
        if(!lastLoaded.StopTime){
            const loadDate = new Date(lastLoaded.LoadTime);
            const stopDate = new Date();
            const differenceInSeconds = (stopDate.getTime() - loadDate.getTime()) / 1000;
            sum += differenceInSeconds;
        }
        return sum;
    }

    async create(
        ProjectId, LoadTime, StopTime
    ) {
        const id = crypto.randomUUID();
        const loadStat = await this.LoadStatRepository.create({
            Id: id,  Project: { connect: { Id: ProjectId } },
            LoadTime, StopTime
        });
        return loadStat;
    }

    async delete(id) {
        const loadStat = await this.LoadStatRepository.delete(id);
        return loadStat;
    }

    async update(
        id,
        ProjectId, LoadTime, StopTime
    ) {
        const loadStat = await this.LoadStatRepository.update({
            Id: id, Project: { connect: { Id: ProjectId } }, 
            LoadTime, StopTime
        });
        return loadStat;
    }

    async updateLastLoaded(
        ProjectId, StopTime
    ) {
        const lastLoaded = await this.getLastLoaded(ProjectId)
        const loadStat = await this.LoadStatRepository.update({
            Id: lastLoaded.Id, StopTime
        });
        return loadStat;
    }
}

export { LoadStatService };