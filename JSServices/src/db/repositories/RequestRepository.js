class RequestRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.Request.findFirst({ where: { Id: id } });
    }

    create(Request) {
        return this._dbClient.Request.create({
            data: Request,
        });
    }

    delete(id) {
        return this._dbClient.Request.delete({
            where: {
                Id: id,
            },
        });
    }

    update(Request) {
        return this._dbClient.Request.update({
            where: {
                Id: Request.Id,
            },
            data: Request,
        });
    }
}

export { RequestRepository };