export class TransferModelDto {
    id: number;
    amount: string;
    recipient: string;
    reference: string;
    createdAt: Date;

    constructor(recipient: string, transfer: any) {
        this.id = transfer.id;
        this.amount = transfer.amount.toLocaleString("en", {minimumFractionDigits: 2});
        this.recipient = recipient;
        this.reference = transfer.reference;
        this.createdAt = transfer.createdAt;
    }
}