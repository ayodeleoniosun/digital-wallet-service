import {SignupDto} from "../../dtos/requests/authentication/signup.dto";
import {User} from "../../database/models/user";

export class AuthRepository {
    async create(payload: Partial<SignupDto>): Promise<User> {
        return await User.create(payload);
    }

    async getUserByEmail(email: string): Promise<User> {
        return await User.findOne({ where: { email} });
    }
}