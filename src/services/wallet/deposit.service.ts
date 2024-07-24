import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import {DepositModelDto} from "../../dtos/models/wallet/deposit.model";
import HttpException from "../../utils/exceptions/http.exception";
import {WalletErrorMessages} from "../../utils/enums/messages/wallet/wallet.error.messages";
import * as HttpStatus from 'http-status';
import {DepositRepository} from "../../repositories/wallet/deposit.repository";
import {databaseService} from "../../utils/database";
import {Container, Service} from "typedi";
import {FundWalletRequestDto} from "../../dtos/requests/wallet/fund.wallet.request.dto";

@Service()
export class DepositService {
    public walletRepository = Container.get(WalletRepository);
    public depositRepository = Container.get(DepositRepository);

    async depositAlreadyCompleted(reference: string): Promise<boolean> {
        const checkFundedInDB = await this.depositRepository.getDepositByReference(reference);

        return !!checkFundedInDB;
    }

    async execute(userId: number, payload: FundWalletRequestDto): Promise<DepositModelDto> {

        const {reference, amount} = payload;

        try {
            return await databaseService.sequelize.transaction(async transaction => {
                const wallet = await this.walletRepository.lockForUpdate(userId, transaction);

                if (!wallet) {
                    throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                const depositAlreadyCompleted = await this.depositAlreadyCompleted(reference);

                if (depositAlreadyCompleted) {
                    throw new HttpException(WalletErrorMessages.DEPOSIT_ALREADY_DONE, HttpStatus.BAD_REQUEST);
                }

                payload.userId = userId;

                const deposit = await this.depositRepository.create(payload, {transaction: transaction});

                await this.walletRepository.incrementBalance(wallet, amount, transaction);

                return new DepositModelDto(deposit);
            });

        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

