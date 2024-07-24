import {faker} from "@faker-js/faker";
import {Deposit} from "../../src/database/models/deposit";

export const getDeposit = (overrides?: Partial<Deposit>): Partial<Deposit> => {
    let deposit = new Deposit();
    deposit.id = faker.number.int({min: 1, max: 10});
    deposit.userId = 1;
    deposit.source = 'bank_transfer';
    deposit.amount = 1000;
    deposit.reference = faker.string.alphanumeric(12);
    deposit.account_number = faker.string.numeric(10);
    deposit.account_name = faker.person.fullName();
    deposit.bank_name = faker.company.name();

    return {...deposit.dataValues, ...overrides};
};