import {WalletRepository} from "../repositories/wallet/wallet.repository";
import {WalletModelDto} from "../dtos/models/wallet/wallet.model";
import {FundWalletRequestDto} from "../dtos/requests/wallet/fund.wallet.request.dto";
import {DepositModelDto} from "../dtos/models/wallet/deposit.model";
import HttpException from "../utils/exceptions/http.exception";
import {WalletErrorMessages} from "../utils/enums/messages/wallet/wallet.error.messages";
import * as HttpStatus from 'http-status';
import {DepositRepository} from "../repositories/wallet/deposit.repository";
import {databaseService} from "../utils/database";

export class WalletService {
    constructor(
        public walletRepository: WalletRepository,
        public depositRepository: DepositRepository
    ) {
    }

    async getUserWallet(userId: number): Promise<WalletModelDto> {
        const getWallet = await this.walletRepository.getWallet(userId);

        if (getWallet) {
            const {balance, createdAt} = getWallet;

            return new WalletModelDto(balance, createdAt);
        }

        const {balance, createdAt} = await this.walletRepository.create({userId: userId});

        return new WalletModelDto(balance, createdAt);
    }

    async fund(userId: number, payload: FundWalletRequestDto): Promise<DepositModelDto> {
        const {reference, amount} = payload;

        const getWallet = await this.walletRepository.getWallet(userId);

        if (!getWallet) {
            throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const depositAlreadyDone = await this.depositRepository.getDepositByReference(reference);

        if (depositAlreadyDone) {
            throw new HttpException(WalletErrorMessages.DEPOSIT_ALREADY_DONE, HttpStatus.BAD_REQUEST);
        }

        try {
            return await databaseService.sequelize.transaction(async transaction => {
                const wallet = await this.walletRepository.lockWalletForUpdate(userId, transaction);

                if (!wallet) {
                    throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                payload.userId = userId;

                const deposit = await this.depositRepository.create(payload, {transaction: transaction});

                await this.walletRepository.incrementBalance(wallet, amount, transaction);
                
                return new DepositModelDto(deposit);
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}

