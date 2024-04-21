import { LogNotFoundError } from '../exceptions/LogExceptions.js';
import crypto from 'crypto';

class LogService {
    constructor(LogRepository) {
        this.LogRepository = LogRepository;
    }

    async getById(id) {
        const log = await this.LogRepository.getById(id);
        if (!log) {
            throw new LogNotFoundError();
        }

        return log;
    }

    async create(
        ProjectId, Value
    ) {
        const id = crypto.randomUUID();
        const log = await this.LogRepository.create({
            Id: id,
            ProjectId, Value
        });
        return log;
    }

    async delete(id) {
        const log = await this.LogRepository.delete(id);
        return log;
    }

    async update(
        id,
        ProjectId, Value
    ) {
        const log = await this.LogRepository.update({
            Id: id,
            ProjectId, Value
        });
        return log;
    }
}

export { LogService };