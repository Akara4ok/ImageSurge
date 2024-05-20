class CategoryRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getAll() {
        return this._dbClient.Category.findMany();
    }

    getWithFilter(filter) {
        return this._dbClient.Category.findFirst(filter);
    }

    getById(id) {
        return this._dbClient.Category.findFirst({ where: { Id: id } });
    }

    create(Category) {
        return this._dbClient.Category.create({
            data: Category,
        });
    }

    delete(id) {
        return this._dbClient.Category.delete({
            where: {
                Id: id,
            },
        });
    }

    update(Category) {
        return this._dbClient.Category.update({
            where: {
                Id: Category.Id,
            },
            data: Category,
        });
    }
}

export { CategoryRepository };