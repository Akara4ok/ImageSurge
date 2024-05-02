class RequestRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.Request.findFirst({ where: { Id: id } });
    }

    async getStatsByProjectId(id) {
        const result = await this._dbClient.Request.groupBy({
            by: ['ProjectId'],
            where: { ProjectId: id },
            _sum: {
                Images: true,
                ProcessingTime: true,
                ValidationTime: true,
                ClassificationTime: true,
                CroppingTime: true,
                Quality: true,
            },
            _count: {
                _all: true
            }
        });

        if (result.length === 0) {
            return;
        }
        const data = result[0];

        return {
            TotalRequests: data._count._all,
            Images: data._sum.Images,
            ProcessingTime: data._sum.ProcessingTime,
            ValidationTime: data._sum.ValidationTime,
            ClassificationTime: data._sum.ClassificationTime,
            CroppingTime: data._sum.CroppingTime,
            Quality: data._sum.Quality,
        };
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