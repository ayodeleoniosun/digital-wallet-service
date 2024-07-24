import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import {WalletModelDto} from "../../dtos/models/wallet/wallet.model";
import {Container, Service} from "typedi";

@Service()
export class WalletService {
    public walletRepository = Container.get(WalletRepository);

    async getUserWallet(userId: number): Promise<WalletModelDto> {
        const getWallet = await this.walletRepository.getWallet(userId);

        if (getWallet) {
            const {balance, createdAt} = getWallet;

            return new WalletModelDto(balance, createdAt);
        }

        const wallet = await this.walletRepository.create({userId: userId});

        const {balance, createdAt} = wallet;

        return new WalletModelDto(balance, createdAt);
    }
}

