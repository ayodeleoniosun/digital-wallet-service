import {User} from "../../database/models/user";
import {Service} from "typedi";
import {SignupRequestDto} from "../../dtos/requests/authentication/signup.request.dto";

@Service()
export class AuthRepository {
    async create(payload: Partial<SignupRequestDto>): Promise<User> {
        return await User.create(payload);
    }

    async getUserByEmail(email: string): Promise<User> {
        return await User.findOne({where: {email}});
    }

    async delete(email: string) {
        return await User.destroy({where: {email}});
    }
}