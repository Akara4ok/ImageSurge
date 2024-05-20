class ProjectProcessingRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.ProjectProcessing.findFirst({ where: { Id: id } });
    }

    create(ProjectProcessing) {
        return this._dbClient.ProjectProcessing.create({
            data: ProjectProcessing,
        });
    }

    delete(id) {
        return this._dbClient.ProjectProcessing.delete({
            where: {
                Id: id,
            },
        });
    }

    update(ProjectProcessing) {
        return this._dbClient.ProjectProcessing.update({
            where: {
                Id: ProjectProcessing.Id,
            },
            data: ProjectProcessing,
        });
    }
}

export { ProjectProcessingRepository };