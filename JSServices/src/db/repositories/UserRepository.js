class UserRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.User.findFirst({ where: { Id: id } });
    }

    create(User) {
        return this._dbClient.User.create({
            data: User,
        });
    }

    delete(id) {
        return this._dbClient.User.delete({
            where: {
                Id: id,
            },
        });
    }

    update(User) {
        return this._dbClient.User.update({
            where: {
                Id: User.Id,
            },
            data: User,
        });
    }
}

export { UserRepository };