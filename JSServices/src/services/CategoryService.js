import { CategoryNotFoundError } from '../exceptions/CategoryExceptions.js';
import crypto from 'crypto';

class CategoryService {
    constructor(CategoryRepository) {
        this.CategoryRepository = CategoryRepository;
    }

    async getById(id) {
        const category = await this.CategoryRepository.getById(id);
        if (!category) {
            throw new CategoryNotFoundError();
        }

        return category;
    }

    async create(
        Name
    ) {
        const id = crypto.randomUUID();
        const category = await this.CategoryRepository.create({
            Id: id,
            Name
        });
        return category;
    }

    async delete(id) {
        const category = await this.CategoryRepository.delete(id);
        return category;
    }

    async update(
        id,
        Name
    ) {
        const category = await this.CategoryRepository.update({
            Id: id,
            Name
        });
        return category;
    }
}

export { CategoryService };