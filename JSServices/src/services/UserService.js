import { UserWrongDataError, UserExistsError } from '../exceptions/UserExceptions.js';
import { NotFoundError, ValidationError, ForbiddenError } from '../exceptions/GeneralException.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

const SECRET_KEY = process.env.JWT_SECRET_KEY;

class UserService {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }

    async getById(id) {
        const user = await this.UserRepository.getById(id);
        if (!user) {
            throw new NotFoundError('User');
        }
        delete user.Password;

        return user;
    }

    async create(
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Country,
        Password
    ) {
        if(!FirstName || !LastName || !Email || !PhoneNumber || !Country || !Password){
            throw new ValidationError()
        }

        const existingUser = await this.UserRepository.getByFilter({ where: {OR: [{Email: Email}, {PhoneNumber: PhoneNumber}]} });
		if (existingUser) {
			throw new UserExistsError()
		}

        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(Password, 12);
        const user = await this.UserRepository.create({
            Id: id,
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            Password: hashedPassword,
            Role: 'user'
        });
        return user;
    }

    async delete(id) {
        const user = await this.UserRepository.delete(id);
        delete user.Password;
        return user;
    }

    async update(
        id,
        FirstName,
        LastName,
        Email,
        PhoneNumber,
        Country,
        OldPassword,
        NewPassword
    ) {
        const user = await this.UserRepository.getById(id);
        if (!user) {
            throw new NotFoundError("User");
        }
        
        let NewHashedPassword = user.Password
        if(OldPassword && NewPassword){
            const match = await bcrypt.compare(OldPassword, user.Password);
    
            console.log(OldPassword)
            if (!match) {
                throw new ForbiddenError("Password mismatch");
            }

            NewHashedPassword = await bcrypt.hash(NewPassword, 12);
        }
        try{
            const userUpdated = await this.UserRepository.update({
                Id: id,
                FirstName,
                LastName,
                Email,
                PhoneNumber,
                Country,
                Password: NewHashedPassword,
                Role: user.Role
            });
            delete userUpdated.Password;
            return userUpdated;
        } catch(e){
            if (e.code === 'P2002') {
                throw new UserExistsError();
            }
        }
    }

    async login(email, password){
        if (!email || !password) {
            throw new ValidationError();
        }
        
        const user = await this.UserRepository.getByFilter({where: {Email: email}});

        if (!user) {
            throw new NotFoundError("User");
        }

        const isValidPassword = await bcrypt.compare(password, user.Password);
        if (!isValidPassword) {
            throw new UserWrongDataError();
        }

        return jwt.sign({ id: user.Id }, SECRET_KEY, {
            expiresIn: '1h',
        });
    }
}

export { UserService };