import {Container} from "typedi";
import 'reflect-metadata';
import {mockWithdrawalRepository} from "../mocks/repositories/withdrawal.mock.repository";
import {mockWalletRepository} from "../mocks/repositories/wallet.mock.repository";
import {WalletRepository} from "../../src/repositories/wallet/wallet.repository";
import withdrawal from "../fixtures/payloads/withdrawal.test.payload";
import {WithdrawalService} from "../../src/services/wallet/withdrawal.service";
import {WithdrawalRepository} from "../../src/repositories/wallet/withdrawal.repository";
import {getWithdrawal} from "../fixtures/withdrawal.fixture";
import {getWallet} from "../fixtures/wallet.fixture";
import {WithdrawalModelDto} from "../../src/dtos/models/wallet/withdrawal.model";
import {WalletErrorMessages} from "../../src/utils/enums/messages/wallet/wallet.error.messages";

describe('Withdrawals unit tests', () => {
    jest.mock('../../src/repositories/wallet/withdrawal.repository', () => {
        return {
            WithdrawalRepository: jest.fn().mockImplementation(() => mockWithdrawalRepository)
        };
    });

    jest.mock('../../src/repositories/wallet/wallet.repository', () => {
        return {
            WalletRepository: jest.fn().mockImplementation(() => mockWalletRepository)
        };
    });

    let withdrawalService: WithdrawalService;

    beforeAll(async () => {
        Container.set(WalletRepository, mockWalletRepository);
        Container.set(WithdrawalRepository, mockWithdrawalRepository);

        withdrawalService = Container.get(WithdrawalService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('it should throw an error if wallet does not exist', async () => {
        const mockWithdrawalData = getWithdrawal();
        mockWalletRepository.getWallet.mockResolvedValue(null);

        try {
            await withdrawalService.execute(mockWithdrawalData.dataValues.userId, withdrawal);
        } catch (error: any) {
            expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(0);
            expect(mockWithdrawalRepository.create).toBeCalledTimes(0);
            expect(mockWalletRepository.decrementBalance).toBeCalledTimes(0);
            expect(error.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        }
    });

    it('it should throw an error if wallet has insufficient funds', async () => {
        withdrawal.amount = 2000;
        const mockWithdrawalData = getWithdrawal({amount: withdrawal.amount});
        mockWalletRepository.getWallet.mockResolvedValue(getWallet());
        mockWalletRepository.insufficientFunds.mockResolvedValue(true);

        try {
            await withdrawalService.execute(mockWithdrawalData.dataValues.userId, withdrawal);
        } catch (error: any) {
            expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
            expect(mockWalletRepository.insufficientFunds).toBeCalledTimes(1);
            expect(error.message).toBe(WalletErrorMessages.INSUFFICIENT_FUNDS);
        }
    });

    it('it should debit user wallet and decrement balance', async () => {
        const mockWithdrawalData = getWithdrawal();
        mockWalletRepository.getWallet.mockResolvedValue(getWallet());
        mockWalletRepository.lockForUpdate.mockResolvedValue(getWallet());
        mockWithdrawalRepository.create.mockResolvedValue(mockWithdrawalData);

        const newBalance = getWallet().dataValues.balance - withdrawal.amount;
        mockWalletRepository.decrementBalance.mockResolvedValue(getWallet({balance: newBalance}));

        const funded = await withdrawalService.execute(mockWithdrawalData.dataValues.userId, withdrawal);

        expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
        expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
        expect(mockWithdrawalRepository.create).toBeCalledTimes(1);
        expect(mockWalletRepository.decrementBalance).toBeCalledTimes(1);
        expect(funded).toBeInstanceOf(WithdrawalModelDto);
        expect(funded).toHaveProperty('userId', mockWithdrawalData.dataValues.userId);
        expect(funded).toHaveProperty('account_name', mockWithdrawalData.dataValues.account_name);
        expect(funded).toHaveProperty('account_number', mockWithdrawalData.dataValues.account_number);
    });
});