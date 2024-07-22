import {Withdrawal} from "../../database/models/withdrawal";
import {Service} from "typedi";
import {IDebitWallet} from "../../interfaces/wallet/debit.wallet.interface";

@Service()
export class WithdrawalRepository {
    async create(payload: Partial<IDebitWallet>, transaction: any): Promise<Withdrawal> {
        return new Promise(async (resolve, reject) => {
            try {
                const withdrawal = await Withdrawal.create(payload, transaction);
                resolve(withdrawal as Withdrawal);
            } catch (e) {
                reject(e);
            }
        });
    }

}