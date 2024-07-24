import {User} from "../../src/database/models/user";
import {faker} from "@faker-js/faker";

export const validEmail = 'valid_email@gmail.com';
export const validPassword = 'JohnDoe@2024';

export const createUser = async (overrides = {}) => {
    return (await User.create({
        firstname: faker.internet.displayName(),
        lastname: faker.internet.displayName(),
        email: validEmail,
        password: validPassword,
        ...overrides,
    })).dataValues;
};