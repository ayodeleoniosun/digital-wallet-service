import {Service} from "typedi";
import {Transfer} from "../../database/models/transfer";
import {ITransfer} from "../../interfaces/wallet/transfer.interface";
import {User} from "../../database/models/user";

@Service()
export class TransferRepository {
    async create(payload: Partial<ITransfer>, transaction: any): Promise<Transfer> {
        return new Promise(async (resolve, reject) => {
            try {
                const transfer = await Transfer.create(payload, transaction);
                resolve(transfer as Transfer);
            } catch (e) {
                reject(e);
            }
        });
    }

    async findById(id: number): Promise<Transfer> {
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