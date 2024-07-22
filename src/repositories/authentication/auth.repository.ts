import {ISignup} from "../../interfaces/authentication/signup.interface";
import {User} from "../../database/models/user";
import {Service} from "typedi";

@Service()
export class AuthRepository {
    async create(payload: Partial<ISignup>): Promise<User> {
        return await User.create(payload);
    }

    async getUserByEmail(email: string): Promise<User> {
        return await User.findOne({where: {email}});
    }
}