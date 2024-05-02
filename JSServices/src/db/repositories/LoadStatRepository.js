class LoadStatRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.LoadStat.findFirst({ where: { Id: id } });
    }

    getAllByProjectId(id) {
        return this._dbClient.LoadStat.findMany({ where: { ProjectId: id } });
    }

    getLastLoaded(id) {
        return this._dbClient.LoadStat.findFirst({ 
        where: {
            ProjectId: id
        },
        orderBy: {
            LoadTime: 'desc'
        }
     });
    }

    create(LoadStat) {
        return this._dbClient.LoadStat.create({
            data: LoadStat,
        });
    }

    delete(id) {
        return this._dbClient.LoadStat.delete({
            where: {
                Id: id,
            },
        });
    }

    update(LoadStat) {
        return this._dbClient.LoadStat.update({
            where: {
                Id: LoadStat.Id,
            },
            data: LoadStat,
        });
    }
}

export { LoadStatRepository };