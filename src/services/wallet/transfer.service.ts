import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import HttpException from "../../utils/exceptions/http.exception";
import {WalletErrorMessages} from "../../utils/enums/messages/wallet/wallet.error.messages";
import * as HttpStatus from 'http-status';
import {databaseService} from "../../utils/database";
import {Service} from "typedi";
import * as crypto from "crypto";
import {TransferRepository} from "../../repositories/wallet/transfer.repository";
import {AuthRepository} from "../../repositories/authentication/auth.repository";
import {TransferModelDto} from "../../dtos/models/wallet/transfer.model";
import config from "../../config";
import {TransferRequestDto} from "../../dtos/requests/wallet/transfer.request.dto";

@Service()
export class TransferService {
    constructor(
        public walletRepository: WalletRepository,
        public authRepository: AuthRepository,
        public transferRepository: TransferRepository
    ) {
    }

    async execute(senderId: number, payload: TransferRequestDto): Promise<TransferModelDto> {
        const {amount, email} = payload;

        let senderWallet = await this.walletRepository.getWallet(senderId);

        if (!senderWallet) {
            throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const insufficientFunds = this.walletRepository.insufficientFunds(senderWallet, amount);

        if (insufficientFunds) {
            throw new HttpException(WalletErrorMessages.INSUFFICIENT_FUNDS, HttpStatus.BAD_REQUEST);
        }

        const recipient = await this.authRepository.getUserByEmail(email);

        if (!recipient) {
            throw new HttpException(WalletErrorMessages.RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (recipient.id === senderId) {
            throw new HttpException(WalletErrorMessages.FORBIDDEN_TRANSFER, HttpStatus.NOT_FOUND);
        }

        let recipientWallet = await this.walletRepository.getWallet(recipient.id);

        if (!recipientWallet) {
            throw new HttpException(WalletErrorMessages.RECIPIENT_WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        try {
            let transfer = null;

            await databaseService.sequelize.transaction(async transaction => {
                senderWallet = await this.walletRepository.lockForUpdate(senderId, transaction);
                recipientWallet = await this.walletRepository.lockForUpdate(recipient.id, transaction);

                if (!senderWallet || !recipientWallet) {
                    throw new HttpException(WalletErrorMessages.WALLET_LOCK_NOT_ACQUIRED, HttpStatus.BAD_REQUEST);
                }

                payload.senderId = senderId;
                payload.recipientId = recipient.id;
                payload.reference = config.transaction_reference_prefix + crypto.randomBytes(12).toString('hex');

                transfer = await this.transferRepository.create(payload as TransferRequestDto, {transaction: transaction});

                await this.walletRepository.decrementBalance(senderWallet, amount, transaction);

                await this.walletRepository.incrementBalance(recipientWallet, amount, transaction);
            });

            const data = await this.transferRepository.findById(transfer.id);

            return new TransferModelDto(data);

        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

