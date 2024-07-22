import {faker} from "@faker-js/faker";
import {DebitWalletRequestDto} from "../../../src/dtos/requests/wallet/debit.wallet.request.dto";

let withdrawal = new DebitWalletRequestDto();
withdrawal.userId = 1;
withdrawal.amount = 1000;
withdrawal.fee = 10;
withdrawal.reference = faker.string.alphanumeric(12);
withdrawal.account_number = faker.string.numeric(10);
withdrawal.account_name = faker.person.fullName();
withdrawal.bank_name = faker.company.name();

export default withdrawal;