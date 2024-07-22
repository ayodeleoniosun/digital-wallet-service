import {faker} from "@faker-js/faker";
import {TransferRequestDto} from "../../../src/dtos/requests/wallet/transfer.request.dto";

let transfer = new TransferRequestDto();
transfer.email = faker.internet.email();
transfer.amount = 1000;

export default transfer;