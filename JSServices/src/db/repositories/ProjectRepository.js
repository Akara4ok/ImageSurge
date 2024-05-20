class ProjectRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getAll(filter) {
        return this._dbClient.Project.findMany(filter);
    }

    getWithFilter(filter) {
        return this._dbClient.Project.findFirst(filter);
    }

    getById(id) {
        return this._dbClient.Project.findFirst({ where: { Id: id } });
    }

    getFullInfoById(id) {
        return this._dbClient.Project.findFirst({ 
            where: { Id: id },
            include: {
                Datasets: true,
                ProjectProcessings: true,
                NeuralNetwork: true,
                CroppingNetwork: true
            }
        });
    }

    getProjectWithProcessingByName(email, name) {
        return this._dbClient.Project.findFirst({ 
            where: {
                User: {
                    is: {
                        Email: email
                    }
                },
                Name: name 
            },
            include: {
                ProjectProcessings: true,
                User: true
            }
        });
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