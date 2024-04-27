class LogRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.Log.findFirst({ where: { Id: id } });
    }

    create(Log) {
        return this._dbClient.Log.create({
            data: Log,
        });
    }

    delete(id) {
        return this._dbClient.Log.delete({
            where: {
                Id: id,
            },
        });
    }

    update(Log) {
        return this._dbClient.Log.update({
            where: {
                Id: Log.Id,
            },
            data: Log,
        });
    }
}

export { LogRepository };