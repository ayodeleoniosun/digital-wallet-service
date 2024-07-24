import {Deposit} from "../../database/models/deposit";
import {Service} from "typedi";
import {FundWalletRequestDto} from "../../dtos/requests/wallet/fund.wallet.request.dto";
import {databaseService} from "../../utils/database";

@Service()
export class DepositRepository {
    async create(payload: Partial<FundWalletRequestDto>, transaction: any): Promise<object> {
        const deposit = await Deposit.create(payload, transaction) as Deposit;

        return deposit.dataValues;
    }

    async getDepositByReference(reference: string): Promise<object> {
        return (await Deposit.findOne({
            where: {reference}
        }));
    }

    async deleteAll() {
        await databaseService.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Deposit.truncate({cascade: true});
    }
}