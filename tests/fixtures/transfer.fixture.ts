import {faker} from "@faker-js/faker";
import {Transfer} from "../../src/database/models/transfer";

export const getTransfer = (overrides?: Partial<Transfer>): Partial<Transfer> => {
    let transfer = new Transfer();
    transfer.id = faker.number.int({min: 1, max: 10});
    transfer.senderId = 1;
    transfer.recipientId = 2;
    transfer.amount = 1000;
    transfer.reference = faker.string.alphanumeric(12);

    return {...transfer, ...overrides};
};