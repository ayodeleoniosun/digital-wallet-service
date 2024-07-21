export class FundWalletRequestDto {
    userId: number;
    source: string;
    account_number?: string;
    account_name?: string;
    bank_name?: string;
    amount: number;
    reference: string;
    last_4_digits?: string;
    auth_token?: string;
}