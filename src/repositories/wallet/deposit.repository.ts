import {IFundWallet} from "../../interfaces/wallet/fund.wallet.interface";
import {Deposit} from "../../database/models/deposit";
import {Service} from "typedi";

@Service()
export class DepositRepository {
    async create(payload: Partial<IFundWallet>, transaction: any): Promise<IFundWallet> {
        return await Deposit.create(payload, transaction) as IFundWallet;
    }

    async getDepositByReference(reference: string): Promise<IFundWallet> {
        return await Deposit.findOne({
            where: {reference}
        }) as IFundWallet;
    }
}