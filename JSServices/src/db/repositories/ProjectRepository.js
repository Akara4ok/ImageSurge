class ProjectRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.Project.findFirst({ where: { Id: id } });
    }

    create(Project) {
        return this._dbClient.Project.create({
            data: Project,
        });
    }

    delete(id) {
        return this._dbClient.Project.delete({
            where: {
                Id: id,
            },
        });
    }

    update(Project) {
        return this._dbClient.Project.update({
            where: {
                Id: Project.Id,
            },
            data: Project,
        });
    }
}

export { ProjectRepository };