import {AuthService} from '../../src/services/auth.service';
import {faker} from "@faker-js/faker";
import {mockAuthRepository} from "../mocks/repositories/auth.mock.repository";
import {getUser} from "../fixtures/user.fixture";
import {AuthErrorMessages} from "../../src/utils/enums/messages/authentication/auth.error.messages";
import {Container} from "typedi";
import 'reflect-metadata';
import {JwtService} from "../../src/services/jwt.service";
import {AuthRepository} from "../../src/repositories/authentication/auth.repository";
import {UserModelDto} from "../../src/dtos/models/authentication/user.model.dto";
import {mockJWTService} from "../mocks/services/jwt.mock.service";
import {SignupRequestDto} from "../../src/dtos/requests/authentication/signup.request.dto";
import {LoginRequestDto} from "../../src/dtos/requests/authentication/login.request.dto";

describe('Authentication unit tests', () => {
    let authService: AuthService;

    beforeAll(async () => {
        Container.set(JwtService, mockJWTService);
        Container.set(AuthRepository, mockAuthRepository);

        authService = Container.get(AuthService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('Registration', () => {
        it('it should throw an error if email already exist during registration', async () => {
            const mockUserData = getUser();
            mockAuthRepository.getUserByEmail.mockResolvedValue(mockUserData);

            let payload = new SignupRequestDto();
            payload.firstname = faker.internet.displayName();
            payload.lastname = faker.internet.displayName();
            payload.email = faker.internet.email();
            payload.password = 'JohnDoe@2024';

            try {
                await authService.register(payload);
            } catch (error: any) {
                expect(mockAuthRepository.getUserByEmail).toBeCalledTimes(1);
                expect(mockAuthRepository.create).toBeCalledTimes(0);
                expect(error.message).toBe(AuthErrorMessages.USER_ALREADY_EXISTS);
            }
        });

        it('it can create new user', async () => {
            const mockUserData = getUser();
            mockAuthRepository.getUserByEmail.mockResolvedValue(null);
            mockAuthRepository.create.mockResolvedValue(mockUserData);

            const payload = new SignupRequestDto();
            payload.firstname = mockUserData.firstname;
            payload.lastname = mockUserData.lastname;
            payload.email = mockUserData.email;
            payload.password = 'JohnDoe@2024';

            const registeredUser = await authService.register(payload);
            expect(registeredUser).toBeInstanceOf(UserModelDto);
            expect(registeredUser).toHaveProperty('id', mockUserData.id);
            expect(registeredUser).toHaveProperty('email', mockUserData.email);
        });
    });

    describe('Login', () => {
        it('it should throw an error if user does not exist during login', async () => {
            mockAuthRepository.getUserByEmail.mockResolvedValue(null);

            const payload = new LoginRequestDto();
            payload.email = faker.internet.email();
            payload.password = 'JohnDoe@2024';

            try {
                await authService.login(payload);
            } catch (error: any) {
                expect(error.message).toBe(AuthErrorMessages.USER_NOT_FOUND);
            }
        });

        it('it should throw an error if login credentials are invalid', async () => {
            const mockUserData = getUser();
            mockAuthRepository.getUserByEmail.mockResolvedValue(mockUserData);

            const payload = new LoginRequestDto();
            payload.email = mockUserData.email;
            payload.password = 'IncorrectPassword';
            
            try {
                await authService.login(payload);
            } catch (error: any) {
                expect(error.message).toBe(AuthErrorMessages.INCORRECT_LOGIN_CREDENTIALS);
            }
        });

        it('it should login if correct credentials are supplied', async () => {
            const mockUserData = getUser();
            mockAuthRepository.getUserByEmail.mockResolvedValue(mockUserData);
            mockJWTService.generateToken.mockResolvedValue('ThisIsAValidToken');

            const payload = new LoginRequestDto();
            payload.email = mockUserData.email;
            payload.password = 'JohnDoe@2024';

            const loggedInUser = await authService.login(payload);

            const response = JSON.parse(JSON.stringify(loggedInUser));
            expect(loggedInUser).toBeInstanceOf(Object);
            expect(loggedInUser).toHaveProperty('token');
            expect(response.user.email).toBe(payload.email);
        });
    });
});