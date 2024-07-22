import {Transfer} from "../../../database/models/transfer";

export class TransferModelDto {
    sender: string;
    recipient: string;
    amount: number;
    reference: string;
    createdAt: Date;

    constructor(transfer: Transfer) {
        this.sender = transfer.sender['fullname'];
        this.recipient = transfer.recipient['fullname'];
        this.reference = transfer.reference;
        this.createdAt = transfer.createdAt;
    }
}