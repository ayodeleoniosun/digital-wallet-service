import request from "supertest";
import app from '../../src/app';
import * as HttpStatus from 'http-status';
import {databaseService} from "../../src/utils/database";
import {faker} from "@faker-js/faker";
import {validEmail, validPassword} from "../factories/user.factory";
import {AuthErrorMessages} from "../../src/utils/enums/messages/authentication/auth.error.messages";
import {AuthSuccessMessages} from "../../src/utils/enums/messages/authentication/auth.success.messages";
import {AuthRepository} from "../../src/repositories/authentication/auth.repository";

describe('Authentication Controller', () => {
    const authRepository = new AuthRepository();

    let registerPayload = {
        firstname: faker.internet.displayName(),
        lastname: faker.internet.displayName(),
        email: faker.internet.email(),
        password: validPassword,
    };

    let loginPayload = {
        email: faker.internet.email(),
        password: '12345678',
    };

    beforeAll(async () => {
        //process.env.NODE_ENV = 'testing';
        await databaseService.authenticate();
    });

    beforeEach(async () => {
        await authRepository.deleteAll();
    });

    afterAll(async () => {
        await databaseService.close();
    });

    const baseUrl = '/api/auth';

    describe('POST: /api/auth/register', () => {
        it('it cannot create new user if invalid email is supplied', async () => {
            let payload = JSON.parse(JSON.stringify(registerPayload));
            payload.email = 'invalidEmail';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);
            console.log(data);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.INVALID_EMAIL_SUPPLIED);
        });

        it('it cannot create new user if password has less than 8 characters', async () => {
            let payload = JSON.parse(JSON.stringify(registerPayload));
            payload.password = '123456';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.PASSWORD_MIN_LEGNTH_ERROR);
        });

        it('it should throw an error if email already exist during registration', async () => {
            await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registerPayload);

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registerPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.CONFLICT);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.USER_ALREADY_EXISTS);
        });

        it('it can create new user', async () => {
            let payload = JSON.parse(JSON.stringify(registerPayload));
            payload.email = validEmail;

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            console.log(data);

            expect(response.statusCode).toBe(HttpStatus.CREATED);
            expect(data.success).toBe(true);
            expect(data.message).toBe(AuthSuccessMessages.REGISTRATION_SUCCESSFUL);
        });
    });

    describe('POST: /api/auth/login', () => {
        it('it should throw an error if user does not exist during login', async () => {
            const response = await request(app)
                .post(`${baseUrl}/login`)
                .set('Accept', 'application/json')
                .send(loginPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.USER_NOT_FOUND);
        });

        it('it should throw an error if login credentials are invalid', async () => {
            //register user first

            await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registerPayload);

            //attempt to login

            let payload = JSON.parse(JSON.stringify(loginPayload));
            payload.email = registerPayload.email;
            payload.password = '123456';

            const response = await request(app)
                .post(`${baseUrl}/login`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
        });

        it('it should login if correct credentials are supplied', async () => {
            await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(registerPayload);

            let payload = JSON.parse(JSON.stringify(loginPayload));
            payload.email = registerPayload.email;
            payload.password = registerPayload.password;

            const response = await request(app)
                .post(`${baseUrl}/login`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.success).toBe(true);
            expect(data.message).toBe(AuthSuccessMessages.LOGIN_SUCCESSFUL);
        });
    });
});
