import {WalletRepository} from "../repositories/wallet/wallet.repository";
import {WalletModelDto} from "../dtos/models/wallet/wallet.model";

export class WalletService {
    public constructor(private walletRepository: WalletRepository) {
    }

    async getUserWallet(userId: number): Promise<WalletModelDto> {
        const getWallet = await this.walletRepository.getWallet(userId);

        if (getWallet) {
            const {balance, createdAt} = getWallet;

            return new WalletModelDto(balance, createdAt);
        }

        const {balance, createdAt} = await this.walletRepository.create({userId: userId});

        return new WalletModelDto(balance, createdAt);
    }
}

