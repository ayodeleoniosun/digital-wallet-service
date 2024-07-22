import {faker} from "@faker-js/faker";
import {Deposit} from "../../src/database/models/deposit";

export const getBankTransferDeposit = (overrides?: Partial<Deposit>): Partial<Deposit> => {
    let deposit = new Deposit();
    deposit.id = faker.number.int({min: 1, max: 10});
    deposit.userId = 1;
    deposit.source = 'bank_transfer';
    deposit.amount = faker.number.int({min: 10});
    deposit.reference = faker.string.alphanumeric(12);
    deposit.account_number = faker.string.numeric(10);
    deposit.account_name = faker.person.fullName();
    deposit.bank_name = faker.company.name();
    
    return {...deposit, ...overrides};
};

export const getCardDeposit = (overrides?: Partial<Deposit>): Partial<Deposit> => {
    let deposit = new Deposit();
    deposit.id = faker.number.int({min: 1, max: 10});
    deposit.userId = 1;
    deposit.source = 'card';
    deposit.amount = faker.number.int({min: 10});
    deposit.reference = faker.string.alphanumeric(12);
    deposit.last_4_digits = faker.string.numeric(4);
    deposit.auth_token = faker.string.alphanumeric(6);
    return {...deposit, ...overrides};
};