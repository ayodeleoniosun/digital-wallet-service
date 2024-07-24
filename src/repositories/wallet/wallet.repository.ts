import {Wallet} from "../../database/models/wallet";
import {Service} from "typedi";
import {CreateWalletRequestDto} from "../../dtos/requests/wallet/create.wallet.request.dto";
import {databaseService} from "../../utils/database";

@Service()
export class WalletRepository {
    async create(payload: Partial<CreateWalletRequestDto>): Promise<Wallet> {
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

    async deleteAll() {
        await databaseService.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Wallet.truncate({cascade: true});
    }
}