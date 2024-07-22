import request from "supertest";
import app from "../../src/app";
import * as HttpStatus from 'http-status';
import {User} from "../../src/database/models/user";
import {registerPayload} from "../fixtures/payloads/user.test.payload";
import {AuthErrorMessages} from "../../src/utils/enums/messages/authentication/auth.error.messages";

describe('AuthController', () => {
    const baseUrl = '/api/auth';
    const testEmail = 'korapayuser@gmail.com';

    afterAll(async () => {
        await User.destroy({where: {email: testEmail}});
    });

    describe('POST: /api/auth/register', () => {
        it('it cannot create new user if invalid email is supplied', async () => {
            let payload = JSON.parse(JSON.stringify(registerPayload));
            payload.email = 'invalidEmail';

            const response = await request(app)
                .post(`${baseUrl}/register`)
                .set('Accept', 'application/json')
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.INVALID_EMAIL_SUPPLIED);
        });
    });
});
