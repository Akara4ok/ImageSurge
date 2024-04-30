class NeuralNetworkRepository {
    constructor(sequelizeModel) {
        this._dbClient = sequelizeModel;
    }

    getById(id) {
        return this._dbClient.NeuralNetwork.findFirst({ where: { Id: id } });
    }

    getRelatedNetworks(CategoryId, ModelId) {
        return this._dbClient.NeuralNetwork.findMany({ 
            where: { 
                Category: {
                    is: {
                        Id: CategoryId
                    }
                },
                Model: {
                    is: {
                        Id: ModelId
                    }
                }
            },
            include: {
                Category: true,
                Model: true
            }
        });
    }    

    create(NeuralNetwork) {
        return this._dbClient.NeuralNetwork.create({
            data: NeuralNetwork,
        });
    }

    delete(id) {
        return this._dbClient.NeuralNetwork.delete({
            where: {
                Id: id,
            },
        });
    }

    update(NeuralNetwork) {
        return this._dbClient.NeuralNetwork.update({
            where: {
                Id: NeuralNetwork.Id,
            },
            data: NeuralNetwork,
        });
    }
}

export { NeuralNetworkRepository };