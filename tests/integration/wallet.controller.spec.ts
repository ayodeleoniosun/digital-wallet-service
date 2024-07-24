import {databaseService} from "../../src/utils/database";
import {createUser, validPassword} from "../factories/user.factory";
import app from '../../src/app';
import * as HttpStatus from 'http-status';
import request from "supertest";
import {AuthErrorMessages} from "../../src/utils/enums/messages/authentication/auth.error.messages";
import {WalletErrorMessages} from "../../src/utils/enums/messages/wallet/wallet.error.messages";
import {AuthRepository} from "../../src/repositories/authentication/auth.repository";
import {WalletSuccessMessages} from "../../src/utils/enums/messages/wallet/wallet.success.messages";
import {WalletRepository} from "../../src/repositories/wallet/wallet.repository";
import {DepositRepository} from "../../src/repositories/wallet/deposit.repository";
import {getWithdrawal} from "../fixtures/withdrawal.fixture";
import {DebitWalletRequestDto} from "../../src/dtos/requests/wallet/debit.wallet.request.dto";
import {getDeposit} from "../fixtures/deposit.fixture";
import {FundWalletRequestDto} from "../../src/dtos/requests/wallet/fund.wallet.request.dto";

describe('Wallet Controller', () => {
    const deposit = getDeposit();

    const fundWalletPayload = new FundWalletRequestDto();
    fundWalletPayload.source = deposit.source;
    fundWalletPayload.account_number = deposit.account_number;
    fundWalletPayload.account_name = deposit.account_name;
    fundWalletPayload.bank_name = deposit.bank_name;
    fundWalletPayload.amount = deposit.amount;
    fundWalletPayload.reference = deposit.reference;
    fundWalletPayload.last_4_digits = deposit.last_4_digits;
    fundWalletPayload.auth_token = deposit.auth_token;

    const authRepository = new AuthRepository();
    const walletRepository = new WalletRepository();
    const depositRepository = new DepositRepository();

    let token = null;
    let user = null;

    beforeAll(async () => {
        //process.env.NODE_ENV = 'testing';
        await databaseService.authenticate();
    });

    beforeEach(async () => {
        await authRepository.deleteAll();
        await walletRepository.deleteAll();
        await depositRepository.deleteAll();

        const authBaseUrl = '/api/auth';

        user = await createUser();

        const loginResponse = await request(app)
            .post(`${authBaseUrl}/login`)
            .set('Accept', 'application/json')
            .send({
                email: user.email,
                password: validPassword
            });

        const data = JSON.parse(loginResponse.text);

        token = data.data.token;
    });

    afterAll(async () => {
        await databaseService.close();
    });

    const baseUrl = '/api/wallets';

    describe('Get Wallet', () => {
        it('unauthenticated users cannot access wallet', async () => {
            const response = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json');

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.UNAUTHENTICATED_USER);
        });

        it('it should throw an error if invalid requests token is supplied', async () => {
            const response = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer Invalid token');

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.INVALID_TOKEN);
        });

        it('it should create new and get wallet', async () => {
            const response = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.OK);
            expect(data.success).toBe(true);
            expect(data.message).toBe(WalletSuccessMessages.WALLET_RETRIEVED);
            expect(data.data.balance).toBe(0);
        });
    });

    describe('Fund Wallet', () => {
        it('it should throw an error if source is an invalid value', async () => {
            let payload = JSON.parse(JSON.stringify(fundWalletPayload));
            payload.source = 'invalid_source';

            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.SOURCE_VALID_VALUES);
        });

        it('it should throw an error if amount is of negative value', async () => {
            let payload = JSON.parse(JSON.stringify(fundWalletPayload));
            payload.amount = -10;

            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.AMOUNT_MUST_BE_POSITIVE);
        });

        it('it should throw an error if amount is less than N10', async () => {
            let payload = JSON.parse(JSON.stringify(fundWalletPayload));
            payload.amount = 2;

            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.MINIMUM_AMOUNT);
        });

        it('it should throw an error if account number is less than 10 digits', async () => {
            let payload = JSON.parse(JSON.stringify(fundWalletPayload));
            payload.account_number = '012345';

            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.ACCOUNT_NUMBER_LENGTH);
        });

        it('it should throw an error if wallet does not exist', async () => {
            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundWalletPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        });

        it('it should throw an error if user wallet is already funded', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundWalletPayload);

            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundWalletPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.DEPOSIT_ALREADY_DONE);
        });

        it('it should fund user wallet and increment balance', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundWalletPayload);

            let payload = JSON.parse(JSON.stringify(fundWalletPayload));
            payload.reference = 'kora_new_reference';

            const response = await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            const wallet = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const getWallet = JSON.parse(wallet.text);

            expect(response.statusCode).toBe(HttpStatus.CREATED);
            expect(data.success).toBe(true);
            expect(data.message).toBe(WalletSuccessMessages.FUND_WALLET_SUCCESSFUL);
            expect(data.data.userId).toBe(user.id);
            expect(getWallet.data.balance).toBe('2000');
        });
    });

    describe('Debit Wallet', () => {
        const withdrawal = getWithdrawal();

        const withdrawalPayload = new DebitWalletRequestDto();
        withdrawalPayload.account_number = withdrawal.account_number;
        withdrawalPayload.account_name = withdrawal.account_name;
        withdrawalPayload.bank_name = withdrawal.bank_name;
        withdrawalPayload.amount = withdrawal.amount;
        withdrawalPayload.fee = withdrawal.fee;

        it('it should throw an error if amount is of negative value', async () => {
            let payload = JSON.parse(JSON.stringify(withdrawalPayload));
            payload.amount = -10;

            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.AMOUNT_MUST_BE_POSITIVE);
        });

        it('it should throw an error if account number is less than 10 digits', async () => {
            let payload = JSON.parse(JSON.stringify(withdrawalPayload));
            payload.account_number = '012345';

            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.ACCOUNT_NUMBER_LENGTH);
        });

        it('it should throw an error if fee is of negative value', async () => {
            let payload = JSON.parse(JSON.stringify(withdrawalPayload));
            payload.fee = -10;

            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.FEE_MUST_BE_POSITIVE);
        });

        it('it should throw an error if fee is less than N10', async () => {
            let payload = JSON.parse(JSON.stringify(withdrawalPayload));
            payload.fee = 2;

            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.MINIMUM_FEE);
        });

        it('it should throw an error if wallet does not exist', async () => {
            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(withdrawalPayload);

            const data = JSON.parse(response.text);

            console.log(data);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        });

        it('it should throw an error if user has insufficient funds', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            let payload = JSON.parse(JSON.stringify(withdrawalPayload));
            payload.amount = 2000;

            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(withdrawalPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.INSUFFICIENT_FUNDS);
        });

        it('it should debit user wallet and decrement balance', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundWalletPayload);

            const response = await request(app)
                .post(`${baseUrl}/withdraw`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(withdrawalPayload);

            const data = JSON.parse(response.text);
            
            const wallet = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const getWallet = JSON.parse(wallet.text);

            expect(response.statusCode).toBe(HttpStatus.CREATED);
            expect(data.success).toBe(true);
            expect(data.message).toBe(WalletSuccessMessages.DEBIT_WALLET_SUCCESSFUL);
            expect(data.data.userId).toBe(user.id);
            expect(getWallet.data.balance).toBe('890');
        });
    });
});
