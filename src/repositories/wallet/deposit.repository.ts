import {IFundWallet} from "../../interfaces/wallet/fund.wallet.interface";
import {Deposit} from "../../database/models/deposit";
import {Service} from "typedi";

@Service()
export class DepositRepository {
    async create(payload: Partial<IFundWallet>, transaction: any): Promise<object> {
        const deposit = await Deposit.create(payload, transaction) as Deposit;

        return deposit.dataValues;
    }

    async getDepositByReference(reference: string): Promise<object> {
        return (await Deposit.findOne({
            where: {reference}
        })).dataValues;
    }
}