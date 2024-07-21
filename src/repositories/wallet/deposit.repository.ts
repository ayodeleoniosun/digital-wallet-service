import {FundWalletRequestDto} from "../../dtos/requests/wallet/fund.wallet.request.dto";
import {Deposit} from "../../database/models/deposit";

export class DepositRepository {
    async create(payload: Partial<FundWalletRequestDto>, transaction: object): Promise<Deposit> {
        return await Deposit.create(payload, transaction);
    }

    async getDepositByReference(reference: string): Promise<Deposit> {
        return await Deposit.findOne({
            where: {reference}
        });
    }
}