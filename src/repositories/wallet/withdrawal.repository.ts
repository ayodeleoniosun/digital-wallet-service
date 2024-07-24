import {Withdrawal} from "../../database/models/withdrawal";
import {Service} from "typedi";
import {DebitWalletRequestDto} from "../../dtos/requests/wallet/debit.wallet.request.dto";
import {databaseService} from "../../utils/database";

@Service()
export class WithdrawalRepository {
    async create(payload: Partial<DebitWalletRequestDto>, transaction: any): Promise<Withdrawal> {
        const withdrawal = await Withdrawal.create(payload, transaction) as Withdrawal;

        return withdrawal.dataValues;
    }

    async deleteAll() {
        await databaseService.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Withdrawal.truncate({cascade: true});
    }
}