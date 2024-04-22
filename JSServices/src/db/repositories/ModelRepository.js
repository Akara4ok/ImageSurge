class ModelRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.Model.findFirst({ where: { Id: id } });
    }

    create(Model) {
        return this._dbClient.Model.create({
            data: Model,
        });
    }

    delete(id) {
        return this._dbClient.Model.delete({
            where: {
                Id: id,
            },
        });
    }

    update(Model) {
        return this._dbClient.Model.update({
            where: {
                Id: Model.Id,
            },
            data: Model,
        });
    }
}

export { ModelRepository };