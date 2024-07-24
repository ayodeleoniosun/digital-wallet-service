export enum SourceType {
    BANK_TRANSFER = 'bank_transfer',
    CARD = 'card'
}

export class DepositModelDto {
    id: number;
    userId: number;
    source: string;
    amount: string;
    reference: string;
    account_number?: string;
    account_name?: string;
    bank_name?: string;
    last_4_digits?: string;
    auth_token?: string;
    createdAt: Date;

    constructor(deposit: any) {
        this.id = deposit.id;
        this.userId = deposit.userId;
        this.source = <SourceType>deposit.source;
        this.amount = deposit.amount.toLocaleString("en", {minimumFractionDigits: 2});
        this.reference = deposit.reference;
        this.account_number = deposit.account_number;
        this.account_name = deposit.account_name;
        this.bank_name = deposit.bank_name;
        this.last_4_digits = deposit.last_4_digits;
        this.auth_token = deposit.auth_token;
        this.createdAt = deposit.createdAt;
    }
}