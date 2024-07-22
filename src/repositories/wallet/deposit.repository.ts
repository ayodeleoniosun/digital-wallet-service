import {IFundWallet} from "../../interfaces/wallet/fund.wallet.interface";
import {Deposit} from "../../database/models/deposit";
import {Service} from "typedi";

@Service()
export class DepositRepository {
    async create(payload: Partial<IFundWallet>, transaction: any): Promise<Deposit> {
        return new Promise(async (resolve, reject) => {
            try {
                const deposit = await Deposit.create(payload, transaction);
                resolve(deposit as Deposit);
            } catch (e) {
                reject(e);
            }
        });
    }

    async getDepositByReference(reference: string): Promise<IFundWallet> {
        return await Deposit.findOne({
            where: {reference}
        }) as IFundWallet;
    }
}