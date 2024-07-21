import {CreateWalletRequestDto} from "../../dtos/requests/wallet/create.wallet.request.dto";
import {Wallet} from "../../database/models/wallet";
import {Service} from "typedi";

@Service()
export class WalletRepository {
    async create(payload: CreateWalletRequestDto): Promise<Wallet> {
        return await Wallet.create(payload);
    }

    async getWallet(userId: number): Promise<Wallet> {
        return await Wallet.findOne({
            where: {userId}
        });
    }

    async lockWalletForUpdate(userId: number, transaction: object): Promise<Wallet> {
        return await Wallet.findOne({
            where: {userId},
            lock: transaction.LOCK.UPDATE,
            transaction
        });
    }

    async incrementBalance(wallet: Wallet, amount: number, transaction: object): Promise<Wallet> {
        return await wallet.increment(
            'balance',
            {by: amount, transaction: transaction}
        );
    }

    async decrementBalance(wallet: Wallet, amount: number, transaction: object): Promise<Wallet> {
        return await wallet.decrement(
            'balance',
            {by: amount, transaction: transaction}
        );
    }
}