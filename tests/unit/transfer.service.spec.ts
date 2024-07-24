import {Container} from "typedi";
import 'reflect-metadata';
import {mockTransferRepository} from "../mocks/repositories/transfer.mock.repository";
import {mockWalletRepository} from "../mocks/repositories/wallet.mock.repository";
import {WalletRepository} from "../../src/repositories/wallet/wallet.repository";
import {mockAuthRepository} from "../mocks/repositories/auth.mock.repository";
import {TransferService} from "../../src/services/wallet/transfer.service";
import {TransferRepository} from "../../src/repositories/wallet/transfer.repository";
import {AuthRepository} from "../../src/repositories/authentication/auth.repository";
import {getTransfer} from "../fixtures/transfer.fixture";
import {WalletErrorMessages} from "../../src/utils/enums/messages/wallet/wallet.error.messages";
import {getWallet} from "../fixtures/wallet.fixture";
import {getUser} from "../fixtures/user.fixture";
import {TransferModelDto} from "../../src/dtos/models/wallet/transfer.model";
import {TransferRequestDto} from "../../src/dtos/requests/wallet/transfer.request.dto";
import {faker} from "@faker-js/faker";

let transfer = new TransferRequestDto();
transfer.email = faker.internet.email();
transfer.amount = 1000;

describe('Transfer unit tests', () => {
    let transferService: TransferService;

    beforeAll(async () => {
        Container.set(AuthRepository, mockAuthRepository);
        Container.set(WalletRepository, mockWalletRepository);
        Container.set(TransferRepository, mockTransferRepository);

        transferService = Container.get(TransferService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('it should throw an error if wallet does not exist', async () => {
        const mockTransferData = getTransfer();
        mockWalletRepository.lockForUpdate.mockResolvedValue(null);

        try {
            await transferService.execute(mockTransferData.senderId, transfer);
        } catch (error: any) {
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
            expect(mockTransferRepository.create).toBeCalledTimes(0);
            expect(mockWalletRepository.decrementBalance).toBeCalledTimes(0);
            expect(error.message).toBe(WalletErrorMessages.WALLET_NOT_FOUND);
        }
    });

    it('it should throw an error if wallet has insufficient funds', async () => {
        transfer.amount = 2000;
        const mockTransferData = getTransfer({amount: transfer.amount});
        mockWalletRepository.lockForUpdate.mockResolvedValue(getWallet());
        mockWalletRepository.insufficientFunds.mockResolvedValue(true);

        try {
            await transferService.execute(mockTransferData.senderId, transfer);
        } catch (error: any) {
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
            expect(mockWalletRepository.insufficientFunds).toBeCalledTimes(1);
            expect(error.message).toBe(WalletErrorMessages.INSUFFICIENT_FUNDS);
        }
    });

    it('it should throw an error if recipient does not exist', async () => {
        const mockTransferData = getTransfer();
        mockWalletRepository.lockForUpdate.mockResolvedValue(getWallet());
        mockWalletRepository.insufficientFunds.mockResolvedValue(false);
        mockAuthRepository.getUserByEmail.mockResolvedValue(null);

        try {
            await transferService.execute(mockTransferData.senderId, transfer);
        } catch (error: any) {
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
            expect(mockWalletRepository.insufficientFunds).toBeCalledTimes(1);
            expect(error.message).toBe(WalletErrorMessages.RECIPIENT_NOT_FOUND);
        }
    });

    it('it should throw an error if sender attempt to transfer to his wallet', async () => {
        const mockTransferData = getTransfer();
        mockWalletRepository.lockForUpdate.mockResolvedValue(getWallet());
        mockWalletRepository.insufficientFunds.mockResolvedValue(false);
        mockAuthRepository.getUserByEmail.mockResolvedValue(getUser({id: 1}));

        try {
            await transferService.execute(mockTransferData.senderId, transfer);
        } catch (error: any) {
            expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(1);
            expect(mockWalletRepository.insufficientFunds).toBeCalledTimes(1);
            expect(error.message).toBe(WalletErrorMessages.FORBIDDEN_TRANSFER);
        }
    });

    it('it should transfer from sender to recipient wallet and update balance accordingly', async () => {
        const mockTransferData = getTransfer();
        mockWalletRepository.lockForUpdate.mockResolvedValue(getWallet({id: 1, userId: transfer.senderId}));
        mockWalletRepository.insufficientFunds.mockResolvedValue(false);
        mockWalletRepository.lockForUpdate.mockResolvedValue(getWallet({id: 2, userId: transfer.recipientId}));
        mockAuthRepository.getUserByEmail.mockResolvedValue(getUser({id: 2}));
        mockTransferRepository.create.mockResolvedValue(mockTransferData);
        mockTransferRepository.findById.mockResolvedValue(mockTransferData);

        const newBalance = getWallet().balance - transfer.amount;
        mockWalletRepository.decrementBalance.mockResolvedValue(getWallet({balance: newBalance}));

        const transferResponse = await transferService.execute(mockTransferData.senderId, transfer);

        expect(mockWalletRepository.lockForUpdate).toBeCalledTimes(2);
        expect(mockTransferRepository.create).toBeCalledTimes(1);
        expect(mockWalletRepository.decrementBalance).toBeCalledTimes(1);
        expect(transferResponse).toBeInstanceOf(TransferModelDto);
        expect(transferResponse).toHaveProperty('recipient', transfer.email);
    });
});