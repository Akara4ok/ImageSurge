import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class CategoryController {
    constructor(CategoryService) {
        this.CategoryService = CategoryService;
    }

    async getAll(req, res) {
        const categories = await this.CategoryService.getAll();
        return res.status(HttpStatusCode.OK).json({
            categories,
        });
    }

    async getById(req, res) {
        const { id } = req.params;
        const category = await this.CategoryService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            category,
        });
    }

    async create(req, res) {
        const { Name } = req.body;

        const category = await this.CategoryService.create(
            Name
        );

        return res.status(HttpStatusCode.CREATED).json({
            category
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const category = await this.CategoryService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            category,
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { Name } = req.body;

        const category = await this.CategoryService.update(
            id, Name
        );

        return res.status(HttpStatusCode.OK).json({
            category,
        });
    }
}

export { CategoryController };