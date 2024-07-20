export class WalletModelDto {
    balance: number;
    createdAt: Date;

    constructor(balance: number, createdAt: Date) {
        this.balance = balance;
        this.createdAt = createdAt;
    }
}