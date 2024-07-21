import {FundWalletRequestDto} from "../../dtos/requests/wallet/fund.wallet.request.dto";
import {Withdrawal} from "../../database/models/withdrawal";
import {Service} from "typedi";

@Service()
export class WithdrawalRepository {
    async create(payload: FundWalletRequestDto, transaction: object): Promise<Withdrawal> {
        return await Withdrawal.create(payload, transaction);
    }
}