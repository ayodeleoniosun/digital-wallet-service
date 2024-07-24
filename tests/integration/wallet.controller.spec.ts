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
import {getTransfer} from "../fixtures/transfer.fixture";
import {TransferRequestDto} from "../../src/dtos/requests/wallet/transfer.request.dto";

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
    let authBaseUrl = null;

    beforeAll(async () => {
        //process.env.NODE_ENV = 'testing';
        await databaseService.authenticate();
    });

    beforeEach(async () => {
        await authRepository.deleteAll();
        await walletRepository.deleteAll();
        await depositRepository.deleteAll();

        authBaseUrl = '/api/auth';

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
            //create and get wallet
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            //attempt to fund wallet twice with the same reference

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

            //fund wallet twice with the different references

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

            //get wallet to retrieve new balance

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

            //fund and withdraw from wallet

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

            //get wallet to retrieve new balance
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

    describe('Transfer Between Wallets', () => {
        const transfer = getTransfer();

        const transferPayload = new TransferRequestDto();
        transferPayload.email = 'recipient_email@gmail.com';
        transferPayload.amount = transfer.amount;

        it('it should throw an error if amount is of negative value', async () => {
            let payload = JSON.parse(JSON.stringify(transferPayload));
            payload.amount = -10;

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.AMOUNT_MUST_BE_POSITIVE);
        });

        it('it should throw an error if amount is less than N10', async () => {
            let payload = JSON.parse(JSON.stringify(transferPayload));
            payload.amount = 2;

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.MINIMUM_AMOUNT);
        });

        it('it should throw an error if email is invalid', async () => {
            let payload = JSON.parse(JSON.stringify(transferPayload));
            payload.email = 'invalidEmail'

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
            expect(data.success).toBe(false);
            expect(data.message).toBe(AuthErrorMessages.INVALID_EMAIL_SUPPLIED);
        });

        it('it should throw an error if sender wallet does not exist', async () => {
            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(transferPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        });

        it('it should throw an error if sender has insufficient funds', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            let payload = JSON.parse(JSON.stringify(transferPayload));
            payload.amount = 2000;

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.INSUFFICIENT_FUNDS);
        });

        it('it should throw an error if recipient does not exist', async () => {
            //create and get wallet

            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            let payload = JSON.parse(JSON.stringify(fundWalletPayload));
            payload.amount = 3000;

            //fund and attempt to transfer funds to a non-existing recipient

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(transferPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.RECIPIENT_NOT_FOUND);
        });

        it('it should throw an error if recipient wallet does not exist', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            //fund and attempt to transfer funds to sender's wallet

            let fundPayload = JSON.parse(JSON.stringify(fundWalletPayload));
            fundPayload.amount = 3000;

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundPayload);

            //create recipient account
            await createUser({email: transferPayload.email});

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(transferPayload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.RECIPIENT_WALLET_NOT_FOUND);
        });

        it('it should throw an error if sender attempts to transfer to his or her wallet', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            //fund and attempt to transfer funds to sender's wallet

            let fundPayload = JSON.parse(JSON.stringify(fundWalletPayload));
            fundPayload.amount = 3000;

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundPayload);

            let payload = JSON.parse(JSON.stringify(transferPayload));
            payload.email = user.email;

            const response = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const data = JSON.parse(response.text);

            expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(data.success).toBe(false);
            expect(data.message).toBe(WalletErrorMessages.FORBIDDEN_TRANSFER);
        });

        it('it should transfer funds to recipient wallet, decrement sender wallet and increment recipient balance', async () => {
            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            //create recipient account, login to generate token and create wallet
            const recipient = await createUser({email: transferPayload.email});

            const loginResponse = await request(app)
                .post(`${authBaseUrl}/login`)
                .set('Accept', 'application/json')
                .send({
                    email: recipient.email,
                    password: validPassword
                });

            const loginData = JSON.parse(loginResponse.text);

            const recipientToken = loginData.data.token;

            await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${recipientToken}`);

            //fund and transfer funds to sender's wallet
            let fundPayload = JSON.parse(JSON.stringify(fundWalletPayload));
            fundPayload.amount = 3000;

            await request(app)
                .post(`${baseUrl}/fund`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(fundPayload);

            let transferRequest = JSON.parse(JSON.stringify(transferPayload));
            transferRequest.email = recipient.email;

            const transferResponse = await request(app)
                .post(`${baseUrl}/transfer`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(transferRequest);

            /*
                after the transfer, sender wallet should have been decremented to 2000
                and recipient wallet incremented to 1000
            */

            const transferData = JSON.parse(transferResponse.text);

            //get sender Wallet
            const senderWallet = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`);

            const getSenderWallet = JSON.parse(senderWallet.text);

            //get recipient Wallet
            const recipientWallet = await request(app)
                .get(`${baseUrl}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${recipientToken}`);

            const getRecipientWallet = JSON.parse(recipientWallet.text);

            expect(transferResponse.statusCode).toBe(HttpStatus.CREATED);
            expect(transferData.success).toBe(true);
            expect(transferData.message).toBe(WalletSuccessMessages.TRANSFER_SUCCESSFUL);
            expect(transferData.data.recipient).toBe(transferRequest.email);
            expect(getSenderWallet.data.balance).toBe('2000');
            expect(getRecipientWallet.data.balance).toBe('1000');
        });
    });
});
