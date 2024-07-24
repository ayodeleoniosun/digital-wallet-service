import {Container} from "typedi";
import 'reflect-metadata';
import {WalletService} from "../../src/services/wallet/wallet.service";
import {WalletRepository} from "../../src/repositories/wallet/wallet.repository";
import {mockWalletRepository} from "../mocks/repositories/wallet.mock.repository";
import {getWallet} from "../fixtures/wallet.fixture";
import {WalletModelDto} from "../../src/dtos/models/wallet/wallet.model";

describe('Wallet unit tests', () => {
    let walletService: WalletService;

    beforeAll(async () => {
        Container.set(WalletRepository, mockWalletRepository);

        walletService = Container.get(WalletService);
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('it should return wallet balance', async () => {
        const mockWalletData = getWallet();
        mockWalletRepository.getWallet.mockResolvedValue(mockWalletData);

        const wallet = await walletService.getUserWallet(mockWalletData.userId);

        expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
        expect(mockWalletRepository.create).toBeCalledTimes(0);
        expect(wallet).toBeInstanceOf(WalletModelDto);
        expect(wallet).toHaveProperty('balance', mockWalletData.id);
    });

    it('it should create new wallet if it does not exist', async () => {
        const mockWalletData = getWallet();
        mockWalletRepository.getWallet.mockResolvedValue(null);
        mockWalletRepository.create.mockResolvedValue(mockWalletData);

        const wallet = await walletService.getUserWallet(mockWalletData.userId);

        expect(mockWalletRepository.getWallet).toBeCalledTimes(1);
        expect(mockWalletRepository.create).toBeCalledTimes(1);
        expect(wallet).toBeInstanceOf(WalletModelDto);
        expect(wallet).toHaveProperty('balance', mockWalletData.id);
    });
});