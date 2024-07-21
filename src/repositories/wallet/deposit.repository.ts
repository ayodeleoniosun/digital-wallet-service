import {FundWalletRequestDto} from "../../dtos/requests/wallet/fund.wallet.request.dto";
import {Deposit} from "../../database/models/deposit";
import {Service} from "typedi";

@Service()
export class DepositRepository {
    async create(payload: FundWalletRequestDto, transaction: object): Promise<Deposit> {
        return await Deposit.create(payload, transaction);
    }

    async getDepositByReference(reference: string): Promise<Deposit> {
        return await Deposit.findOne({
            where: {reference}
        });
    }
}