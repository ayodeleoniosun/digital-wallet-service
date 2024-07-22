export interface ITransfer {
    amount: number;
    reference: string;
    senderId: number;
    recipientId: number;
    createdAt: Date;
}