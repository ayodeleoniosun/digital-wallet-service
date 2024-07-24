import {Container} from "typedi";
import 'reflect-metadata';
import {mockDepositRepository} from "../mocks/repositories/deposit.mock.repository";
import {mockWalletRepository} from "../mocks/repositories/wallet.mock.repository";
import {DepositService} from "../../src/services/wallet/deposit.service";
import {DepositRepository} from "../../src/repositories/wallet/deposit.repository";
import {WalletRepository} from "../../src/repositories/wallet/wallet.repository";
import {getDeposit} from "../fixtures/deposit.fixture";
import deposit from "../fixtures/payloads/deposit.test.payload";
import {WalletErrorMessages} from "../../src/utils/enums/messages/wallet/wallet.error.messages";
import {getWallet} from "../fixtures/wallet.fixture";
import {DepositModelDto} from "../../src/dtos/models/wallet/deposit.model";

describe('Deposit unit tests', () => {
    let depositService: DepositService;

    beforeAll(async () => {
        Container.set(WalletRepository, mockWalletRepository);
        Container.set(DepositRepository, mockDepositRepository);

        depositService = Container.get(DepositService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('it should throw an error if wallet does not exist', async () => {
        const mockDepositData = getDeposit();
        mockWalletRepository.lockForUpdate.mockResolvedValue(null);

        try {
            await depositService.execute(mockDepositData.userId, deposit);
        } catch (error: any) {
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
            expect(mockDepositRepository.create).toBeCalledTimes(0);
            expect(mockWalletRepository.incrementBalance).toBeCalledTimes(0);
            expect(error.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        }
    });

    it('it should throw an error if deposit has already been done', async () => {
        const mockDepositData = getDeposit();
        mockWalletRepository.lockForUpdate.mockResolvedValue(mockDepositData);
        mockDepositRepository.getDepositByReference.mockResolvedValue('validReference');
        mockDepositRepository.create.mockResolvedValue(mockDepositData);

        const newBalance = getWallet().balance + deposit.amount;
        mockWalletRepository.incrementBalance.mockResolvedValue(getWallet({balance: newBalance}));

        try {
            await depositService.execute(mockDepositData.userId, deposit);
        } catch (error: any) {
            expect(error.message).toBe(WalletErrorMessages.DEPOSIT_ALREADY_DONE);
        }
    });

    it('it should fund user wallet and increment balance', async () => {
        const mockDepositData = getDeposit();
        mockWalletRepository.lockForUpdate.mockResolvedValue(mockDepositData);
        mockDepositRepository.getDepositByReference.mockResolvedValue(null);
        mockDepositRepository.create.mockResolvedValue(mockDepositData);

        const newBalance = getWallet().balance + deposit.amount;
        mockWalletRepository.incrementBalance.mockResolvedValue(getWallet({balance: newBalance}));

        const response = await depositService.execute(mockDepositData.userId, deposit);
        
        expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
        expect(mockDepositRepository.create).toBeCalledTimes(1);
        expect(mockWalletRepository.incrementBalance).toBeCalledTimes(1);
        expect(response).toBeInstanceOf(DepositModelDto);
        expect(response).toHaveProperty('source', mockDepositData.source);
        expect(response).toHaveProperty('userId', mockDepositData.userId);
        expect(response).toHaveProperty('account_name', mockDepositData.account_name);
        expect(response).toHaveProperty('account_number', mockDepositData.account_number);
    });
});