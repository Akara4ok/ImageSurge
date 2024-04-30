class ModelRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getAll() {
        return this._dbClient.Model.findMany();
    }

    getById(id) {
        return this._dbClient.Model.findFirst({ where: { Id: id } });
    }

    getByName(name) {
        return this._dbClient.Model.findFirst({ where: { Name: name } });
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