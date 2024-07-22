export interface IDebitWallet {
    userId: number;
    account_number: string;
    account_name: string;
    bank_name: string;
    amount: number;
    fee: number;
    reference: string;
    createdAt: Date;
}