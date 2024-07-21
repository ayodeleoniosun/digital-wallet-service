import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import HttpException from "../../utils/exceptions/http.exception";
import {WalletErrorMessages} from "../../utils/enums/messages/wallet/wallet.error.messages";
import {WithdrawalRepository} from "../../repositories/wallet/withdrawal.repository";
import * as HttpStatus from 'http-status';
import {databaseService} from "../../utils/database";
import {Service} from "typedi";
import {DebitWalletRequestDto} from "../../dtos/requests/wallet/debit.wallet.request.dto";
import {WithdrawalModelDto} from "../../dtos/models/wallet/withdrawal.model";
import * as crypto from "crypto";

@Service()
export class WithdrawalService {
    constructor(public walletRepository: WalletRepository, public withdrawalRepository: WithdrawalRepository) {
    }

    async execute(userId: number, payload: DebitWalletRequestDto): Promise<WithdrawalModelDto> {
        const {amount, fee} = payload;

        const getWallet = await this.walletRepository.getWallet(userId);

        if (!getWallet) {
            throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const totalAmount = amount + fee;

        const insufficientFunds = this.walletRepository.insufficientFunds(getWallet, totalAmount);

        if (insufficientFunds) {
            throw new HttpException(WalletErrorMessages.INSUFFICIENT_FUNDS, HttpStatus.BAD_REQUEST);
        }

        try {
            return await databaseService.sequelize.transaction(async transaction => {
                const wallet = await this.walletRepository.lockWalletForUpdate(userId, transaction);

                if (!wallet) {
                    throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                payload.userId = userId;
                payload.reference = 'kora_' + crypto.randomBytes(12).toString('hex');

                const withdrawal = await this.withdrawalRepository.create(payload as DebitWalletRequestDto, {transaction: transaction});

                await this.walletRepository.decrementBalance(wallet, totalAmount, transaction);

                return new WithdrawalModelDto(withdrawal);
            });

        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
