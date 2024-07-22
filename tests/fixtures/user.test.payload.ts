import {faker} from "@faker-js/faker";

export let registerPayload: {
    firstname: string;
    lastname: string
    email: string;
    password: string;
};

registerPayload = {
    firstname: faker.internet.displayName(),
    lastname: faker.internet.displayName(),
    email: faker.internet.email(),
    password: 'JohnDoe@2024',
};

export let loginPayload: {
    email: string;
    password: string;
};

loginPayload = {
    email: faker.internet.email(),
    password: '12345678',
};