import {Transfer} from "../../../database/models/transfer";

export class TransferModelDto {
    amount: string;
    recipient: string;
    reference: string;
    createdAt: Date;

    constructor(recipient: string, data: Transfer) {
        const transfer = data.dataValues;

        this.amount = transfer.amount.toLocaleString("en", {minimumFractionDigits: 2});
        this.recipient = recipient;
        this.reference = transfer.reference;
        this.createdAt = transfer.createdAt;
    }
}