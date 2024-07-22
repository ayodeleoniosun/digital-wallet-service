import {faker} from "@faker-js/faker";
import {User} from "../../src/database/models/user";
import {hashPassword} from "../../src/utils/helpers/tools";

export const getUser = (overrides?: Partial<User>): Partial<User> => {
    const user = new User();
    user.id = faker.number.int({min: 1, max: 10});
    user.firstname = faker.internet.displayName();
    user.lastname = faker.internet.displayName();
    user.email = faker.internet.email();
    user.password = hashPassword('JohnDoe@2024');
    user.createdAt = new Date();
    return {...user, ...overrides};
};