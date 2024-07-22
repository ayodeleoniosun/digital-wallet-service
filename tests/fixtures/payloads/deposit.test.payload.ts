import {FundWalletRequestDto} from "../../../src/dtos/requests/wallet/fund.wallet.request.dto";
import {faker} from "@faker-js/faker";

let deposit = new FundWalletRequestDto();
deposit.source = 'bank_transfer';
deposit.userId = 1;
deposit.amount = 1000;
deposit.reference = faker.string.alphanumeric(12);
deposit.account_number = faker.string.numeric(10);
deposit.account_name = faker.person.fullName();
deposit.bank_name = faker.company.name();

export default deposit;