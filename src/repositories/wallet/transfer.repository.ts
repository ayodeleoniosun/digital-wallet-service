import {Service} from "typedi";
import {Transfer} from "../../database/models/transfer";
import {ITransfer} from "../../interfaces/wallet/transfer.interface";
import {User} from "../../database/models/user";

@Service()
export class TransferRepository {
    async create(payload: Partial<ITransfer>, transaction: any): Promise<object> {
        const transfer = await Transfer.create(payload, transaction) as Transfer;

        return transfer.dataValues;
    }

    async findById(id: number): Promise<object> {
        return (await Transfer.findByPk(id, {
            include: [{
                model: User,
                as: 'sender'
            }, {
                model: User,
                as: 'recipient'
            }]
        })).dataValues;
    }
}