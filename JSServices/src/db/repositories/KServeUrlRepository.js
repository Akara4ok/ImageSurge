class KServeUrlRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.KServeUrl.findFirst({ where: { Id: id } });
    }

    create(KServeUrl) {
        return this._dbClient.KServeUrl.create({
            data: KServeUrl,
        });
    }

    delete(id) {
        return this._dbClient.KServeUrl.delete({
            where: {
                Id: id,
            },
        });
    }

    update(KServeUrl) {
        return this._dbClient.KServeUrl.update({
            where: {
                Id: KServeUrl.Id,
            },
            data: KServeUrl,
        });
    }
}

export { KServeUrlRepository };