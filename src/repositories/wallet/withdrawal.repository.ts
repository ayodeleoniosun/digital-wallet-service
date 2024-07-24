import {Withdrawal} from "../../database/models/withdrawal";
import {Service} from "typedi";
import {DebitWalletRequestDto} from "../../dtos/requests/wallet/debit.wallet.request.dto";

@Service()
export class WithdrawalRepository {
    async create(payload: Partial<DebitWalletRequestDto>, transaction: any): Promise<Withdrawal> {
        const withdrawal = await Withdrawal.create(payload, transaction) as Withdrawal;

        return withdrawal.dataValues;
    }
}