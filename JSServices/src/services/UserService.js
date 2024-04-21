import { UserNotFoundError, UserForbiddenError } from '../exceptions/UserExceptions.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class UserService {
    constructor(UserRepository) {
        this.UserRepository = UserRepository;
    }

    async getById(id) {
        const user = await this.UserRepository.getById(id);
        if (!user) {
            throw new UserNotFoundError();
        }

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
        const id = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(Password, 12);
        const user = await this.UserRepository.create({
            Id: id,
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            Password: hashedPassword
        });
        return user;
    }

    async delete(id) {
        const user = await this.UserRepository.delete(id);
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
            throw new UserNotFoundError();
        }
        
        let NewHashedPassword = user.Password
        if(OldPassword && NewPassword){
            const match = await bcrypt.compare(OldPassword, user.Password);
    
            if (!match) {
                throw new UserForbiddenError();
            }

            NewHashedPassword = await bcrypt.hash(NewPassword, 12);
        }

        const userUpdated = await this.UserRepository.update({
            Id: id,
            FirstName,
            LastName,
            Email,
            PhoneNumber,
            Country,
            Password: NewHashedPassword
        });
        return userUpdated;
    }
}

export { UserService };