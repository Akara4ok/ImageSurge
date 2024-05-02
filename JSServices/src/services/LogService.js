import { NotFoundError } from '../exceptions/GeneralException.js';
import { ioServer } from '../wssocket/wssocket.js';
import crypto from 'crypto';

class LogService {
    constructor(LogRepository) {
        this.LogRepository = LogRepository;
    }

    async getById(id) {
        const log = await this.LogRepository.getById(id);
        if (!log) {
            throw new NotFoundError();
        }

        return log;
    }

    async getProjectLogs(ProjectId) {
        const logs = await this.LogRepository.getProjectLogs(ProjectId);
        return logs
    }

    async create(
        ProjectId, StatusCode, Function, Value, UserId
    ) {
        if(typeof Value === String){
            return;
        }
        const id = crypto.randomUUID();
        const curDate = new Date();
        const log = await this.LogRepository.create({
            Id: id,  Project: { connect: { Id: ProjectId } },
            Time: curDate, StatusCode, Function, Value
        });
        if(UserId){
            ioServer.sendMessage("log",`${curDate}; ${StatusCode}; ${Function}; ${Value}`, UserId)
        }
        return log;
    }

    async delete(id) {
        const log = await this.LogRepository.delete(id);
        return log;
    }

    async update(
        id,
        ProjectId, Time, StatusCode, Function, Value
    ) {
        const log = await this.LogRepository.update({
            Id: id, Project: { connect: { Id: ProjectId } }, 
            Time, StatusCode, Function, Value
        });
        return log;
    }
}

export { LogService };