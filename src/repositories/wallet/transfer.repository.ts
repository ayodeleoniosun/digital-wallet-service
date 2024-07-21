import {Service} from "typedi";
import {Transfer} from "../../database/models/transfer";
import {TransferRequestDto} from "../../dtos/requests/wallet/transfer.request.dto";
import {Wallet} from "../../database/models/wallet";
import {User} from "../../database/models/user";

@Service()
export class TransferRepository {
    async create(payload: TransferRequestDto, transaction: object): Promise<Transfer> {
        return await Transfer.create(payload, transaction);
    }

    async findById(id: number): Promise<Wallet> {
        return await Transfer.findByPk(id, {
            include: [{
                model: User,
                as: 'sender'
            }, {
                model: User,
                as: 'recipient'
            }]
        });
    }
}