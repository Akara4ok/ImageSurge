class DatasetRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getAll() {
        return this._dbClient.Dataset.findMany();
    }

    getById(id) {
        return this._dbClient.Dataset.findFirst({ where: { Id: id } });
    }

    create(Dataset) {
        return this._dbClient.Dataset.create({
            data: Dataset,
        });
    }

    delete(id) {
        return this._dbClient.Dataset.delete({
            where: {
                Id: id,
            },
        });
    }

    update(Dataset) {
        return this._dbClient.Dataset.update({
            where: {
                Id: Dataset.Id,
            },
            data: Dataset,
        });
    }
}

export { DatasetRepository };