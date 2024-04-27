import { HttpStatusCode } from '../constants/enums/StatusCodes.js';

class UserController {
    constructor(UserService) {
        this.UserService = UserService;
    }

    async getById(req, res) {
        let { id } = req.params;
        if(!id && req.user?.id){
            id = req.user?.id;
        }
        const user = await this.UserService.getById(id);
        return res.status(HttpStatusCode.OK).json({
            user,
        });
    }

    async getSelfInfo(req, res) {
        const user = await this.UserService.getById(req.user.Id);
        return res.status(HttpStatusCode.OK).json({
            user,
        });
    }

    async create(req, res) {
        const { FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            Password } = req.body;

        const user = await this.UserService.create(
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            Password
        );



        return res.status(HttpStatusCode.CREATED).json({
            user
        });
    }

    async delete(req, res) {
        const { id } = req.params;

        const user = await this.UserService.delete(id);

        return res.status(HttpStatusCode.OK).json({
            user,
        });
    }

    async update(req, res) {
        let { id } = req.params;
        if(!id && req.user?.id){
            id = req.user?.id;
        }

        const { FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            OldPassword, NewPassword } = req.body;

        const user = await this.UserService.update(
            id,
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            OldPassword, NewPassword
        );

        return res.status(HttpStatusCode.OK).json({
            user,
        });
    }

    async login(req, res) {
        const { email, password } = req.body;
        const token = await this.UserService.login(email, password);
        return res.status(HttpStatusCode.OK).json({
            token
        });
    }
}

export { UserController };