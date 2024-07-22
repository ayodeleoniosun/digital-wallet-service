import {Withdrawal} from "../../../database/models/withdrawal";

export class WithdrawalModelDto {
    id: number;
    userId: number;
    account_number: string;
    account_name: string;
    bank_name: string;
    amount: string;
    fee: number;
    reference: string;
    createdAt: Date;

    constructor(data: Withdrawal) {
        const withdrawal = data.dataValues;

        this.id = withdrawal.id;
        this.userId = withdrawal.userId;
        this.account_number = withdrawal.account_number;
        this.account_name = withdrawal.account_name;
        this.bank_name = withdrawal.bank_name;
        this.amount = withdrawal.amount;
        this.fee = withdrawal.fee;
        this.reference = withdrawal.reference;
        this.createdAt = withdrawal.createdAt;
    }
}