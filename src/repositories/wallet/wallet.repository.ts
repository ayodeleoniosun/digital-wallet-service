import {IWallet} from "../../interfaces/wallet/wallet.interface";
import {Wallet} from "../../database/models/wallet";
import {Service} from "typedi";

@Service()
export class WalletRepository {
    async create(payload: Partial<IWallet>): Promise<Wallet> {
        return await Wallet.create(payload);
    }

    async getWallet(userId: number): Promise<Wallet> {
        return await Wallet.findOne({
            where: {userId}
        });
    }

    async lockForUpdate(userId: number, transaction: any): Promise<Wallet> {
        return await Wallet.findOne({
            where: {userId},
            lock: transaction.LOCK.UPDATE,
            transaction
        });
    }

    async incrementBalance(wallet: Wallet, amount: number, transaction: any): Promise<Wallet> {
        return await wallet.increment(
            'balance',
            {by: amount, transaction: transaction}
        );
    }

    async decrementBalance(wallet: Wallet, amount: number, transaction: any): Promise<Wallet> {
        return await wallet.decrement(
            'balance',
            {by: amount, transaction: transaction}
        );
    }

    async insufficientFunds(wallet: Wallet, amount: number): Promise<boolean> {
        return await wallet.dataValues.balance < amount;
    }
}