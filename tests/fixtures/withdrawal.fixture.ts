import {faker} from "@faker-js/faker";
import {Withdrawal} from "../../src/database/models/withdrawal";

export const getWithdrawal = (overrides?: Partial<Withdrawal>): Partial<Withdrawal> => {
    let withdrawal = new Withdrawal();
    withdrawal.id = faker.number.int({min: 1, max: 10});
    withdrawal.userId = 1;
    withdrawal.amount = 1000;
    withdrawal.fee = 10;
    withdrawal.reference = faker.string.alphanumeric(12);
    withdrawal.account_number = faker.string.numeric(10);
    withdrawal.account_name = faker.person.fullName();
    withdrawal.bank_name = faker.company.name();

    return {...withdrawal, ...overrides};
};