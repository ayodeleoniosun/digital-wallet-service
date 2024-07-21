import {Withdrawal} from "../../../database/models/withdrawal";

export class WithdrawalModelDto {
    account_number: string;
    account_name: string;
    bank_name: string;
    amount: number;
    fee: number;
    reference: string;
    createdAt: Date;

    constructor(withdrawal: Withdrawal) {
        this.account_number = withdrawal.account_number;
        this.account_name = withdrawal.account_name;
        this.bank_name = withdrawal.bank_name;
        this.amount = withdrawal.amount.toLocaleString("en", {minimumFractionDigits: 2});
        this.fee = withdrawal.fee.toLocaleString("en", {minimumFractionDigits: 2});
        this.reference = withdrawal.reference;
        this.createdAt = withdrawal.createdAt;
    }
}