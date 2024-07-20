import {CreateWalletDto} from "../../dtos/requests/wallet/create.wallet.dto";
import {Wallet} from "../../database/models/wallet";

export class WalletRepository {
    async create(payload: Partial<CreateWalletDto>): Promise<Wallet> {
        return await Wallet.create(payload);
    }

    async getWallet(userId: number): Promise<Wallet> {
        return await Wallet.findOne({where: {userId}});
    }
}