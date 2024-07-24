import {Service} from "typedi";
import {Transfer} from "../../database/models/transfer";
import {User} from "../../database/models/user";
import {TransferRequestDto} from "../../dtos/requests/wallet/transfer.request.dto";
import {databaseService} from "../../utils/database";

@Service()
export class TransferRepository {
    async create(payload: Partial<TransferRequestDto>, transaction: any): Promise<object> {
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

    async deleteAll() {
        await databaseService.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await Transfer.truncate({cascade: true});
    }
}