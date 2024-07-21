import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import {WalletModelDto} from "../../dtos/models/wallet/wallet.model";
import {Service} from "typedi";

@Service()
export class WalletService {
    constructor(public walletRepository: WalletRepository) {
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

