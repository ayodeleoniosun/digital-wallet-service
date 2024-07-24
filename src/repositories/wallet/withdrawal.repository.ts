import {Withdrawal} from "../../database/models/withdrawal";
import {Service} from "typedi";
import {IDebitWallet} from "../../interfaces/wallet/debit.wallet.interface";

@Service()
export class WithdrawalRepository {
    async create(payload: Partial<IDebitWallet>, transaction: any): Promise<Withdrawal> {
        const withdrawal = await Withdrawal.create(payload, transaction) as Withdrawal;

        return withdrawal.dataValues;
    }
}