import {Container} from "typedi";
import 'reflect-metadata';
import {mockDepositRepository} from "../mocks/repositories/deposit.mock.repository";
import {mockWalletRepository} from "../mocks/repositories/wallet.mock.repository";
import {DepositService} from "../../src/services/wallet/deposit.service";
import {DepositRepository} from "../../src/repositories/wallet/deposit.repository";
import {WalletRepository} from "../../src/repositories/wallet/wallet.repository";
import {mockRedisService} from "../mocks/services/redis.mock.service";
import {getBankTransferDeposit} from "../fixtures/deposit.fixture";
import {getWallet} from "../fixtures/wallet.fixture";
import deposit from "../fixtures/payloads/deposit.test.payload";
import {DepositModelDto} from "../../src/dtos/models/wallet/deposit.model";
import {WalletErrorMessages} from "../../src/utils/enums/messages/wallet/wallet.error.messages";
import {RedisService} from "../../src/services/redis.service";

describe('Deposit unit tests', () => {
    jest.mock('../../src/repositories/wallet/deposit.repository', () => {
        return {
            DepositRepository: jest.fn().mockImplementation(() => mockDepositRepository)
        };
    });

    jest.mock('../../src/repositories/wallet/wallet.repository', () => {
        return {
            WalletRepository: jest.fn().mockImplementation(() => mockWalletRepository)
        };
    });

    jest.mock('../../src/services/redis.service', () => {
        return {
            RedisService: jest.fn().mockImplementation(() => mockRedisService)
        };
    });

    let depositService: DepositService;

    beforeAll(async () => {
        Container.set(WalletRepository, mockWalletRepository);
        Container.set(DepositRepository, mockDepositRepository);
        Container.set(RedisService, mockRedisService);

        depositService = Container.get(DepositService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('it should throw an error if wallet does not exist', async () => {
        const mockBankTransferDepositData = getBankTransferDeposit();
        mockWalletRepository.getWallet.mockResolvedValue(null);

        try {
            await depositService.execute(mockBankTransferDepositData.dataValues.userId, deposit);
        } catch (error: any) {
            expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(0);
            expect(mockDepositRepository.create).toBeCalledTimes(0);
            expect(mockWalletRepository.incrementBalance).toBeCalledTimes(0);
            expect(error.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        }
    });

    it('it should throw an error if deposit has already been done', async () => {
        const mockBankTransferDepositData = getBankTransferDeposit();
        mockWalletRepository.getWallet.mockResolvedValue(getWallet());
        mockWalletRepository.lockForUpdate.mockResolvedValue(mockBankTransferDepositData);
        mockDepositRepository.create.mockResolvedValue(mockBankTransferDepositData);

        const newBalance = getWallet().dataValues.balance + deposit.amount;
        mockWalletRepository.incrementBalance.mockResolvedValue(getWallet({balance: newBalance}));

        await depositService.execute(mockBankTransferDepositData.dataValues.userId, deposit);

        try {
            await depositService.execute(mockBankTransferDepositData.dataValues.userId, deposit);
        } catch (error: any) {
            expect(error.message).toBe(WalletErrorMessages.DEPOSIT_ALREADY_DONE);
        }
    });

    it('it should fund user wallet and increment balance', async () => {
        const mockBankTransferDepositData = getBankTransferDeposit();
        mockWalletRepository.getWallet.mockResolvedValue(getWallet());
        mockWalletRepository.lockForUpdate.mockResolvedValue(mockBankTransferDepositData);
        mockDepositRepository.create.mockResolvedValue(mockBankTransferDepositData);

        const newBalance = getWallet().dataValues.balance + deposit.amount;
        mockWalletRepository.incrementBalance.mockResolvedValue(getWallet({balance: newBalance}));

        const funded = await depositService.execute(mockBankTransferDepositData.dataValues.userId, deposit);

        expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
        expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
        expect(mockDepositRepository.create).toBeCalledTimes(1);
        expect(mockWalletRepository.incrementBalance).toBeCalledTimes(1);
        expect(funded).toBeInstanceOf(DepositModelDto);
        expect(funded).toHaveProperty('source', mockBankTransferDepositData.dataValues.source);
        expect(funded).toHaveProperty('userId', mockBankTransferDepositData.dataValues.userId);
        expect(funded).toHaveProperty('account_name', mockBankTransferDepositData.dataValues.account_name);
        expect(funded).toHaveProperty('account_number', mockBankTransferDepositData.dataValues.account_number);
    });
});