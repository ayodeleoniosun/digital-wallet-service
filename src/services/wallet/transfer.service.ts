import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import HttpException from "../../utils/exceptions/http.exception";
import {WalletErrorMessages} from "../../utils/enums/messages/wallet/wallet.error.messages";
import * as HttpStatus from 'http-status';
import {databaseService} from "../../utils/database";
import {Container, Service} from "typedi";
import {TransferRepository} from "../../repositories/wallet/transfer.repository";
import {AuthRepository} from "../../repositories/authentication/auth.repository";
import {TransferModelDto} from "../../dtos/models/wallet/transfer.model";
import {TransferRequestDto} from "../../dtos/requests/wallet/transfer.request.dto";
import {generateReference, insufficientBalance} from "../../utils/helpers/tools";

@Service()
export class TransferService {
    public walletRepository = Container.get(WalletRepository);
    public authRepository = Container.get(AuthRepository);
    public transferRepository = Container.get(TransferRepository);

    async execute(senderId: number, payload: TransferRequestDto): Promise<TransferModelDto> {
        const {amount, email} = payload;

        try {
            let transfer = null;

            await databaseService.sequelize.transaction(async transaction => {
                const senderWallet = await this.walletRepository.lockForUpdate(senderId, transaction);

                if (!senderWallet) {
                    throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                const insufficientFunds = insufficientBalance(senderWallet.balance, amount);

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

                const recipientWallet = await this.walletRepository.lockForUpdate(recipient.id, transaction);

                if (!recipientWallet) {
                    throw new HttpException(WalletErrorMessages.RECIPIENT_WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                payload.senderId = senderId;
                payload.recipientId = recipient.id;
                payload.reference = generateReference();

                transfer = await this.transferRepository.create(payload, {transaction: transaction});

                await this.walletRepository.decrementBalance(senderWallet, amount, transaction);

                await this.walletRepository.incrementBalance(recipientWallet, amount, transaction);
            });

            const data = await this.transferRepository.findById(transfer.id);

            return new TransferModelDto(email, data);

        } catch (error: any) {
            throw new HttpException(error.message, error.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

