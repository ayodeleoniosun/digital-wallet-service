import {faker} from "@faker-js/faker";
import {Wallet} from "../../src/database/models/wallet";

export const getWallet = (overrides?: Partial<Wallet>): Partial<Wallet> => {
    let wallet = new Wallet();
    wallet.id = faker.number.int({min: 1, max: 10});
    wallet.userId = 1;
    wallet.balance = 1000;
    return {...wallet, ...overrides};
};