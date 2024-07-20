import HttpException from "../utils/exceptions/http.exception";
import {AuthErrorMessages} from '../utils/enums/messages/authentication/auth.error.messages';
import * as HttpStatus from 'http-status';
import {WalletRepository} from "../repositories/wallet/wallet.repository";
import {CreateWalletDto} from "../dtos/requests/wallet/create.wallet.dto";
import {WalletModelDto} from "../dtos/models/wallet/wallet.model";

export class WalletService {
    public constructor(private walletRepository: WalletRepository) {
    }

    async getUserWallet(payload: CreateWalletDto): Promise<WalletModelDto> {
        const {userId} = payload;

        const getWallet = await this.walletRepository.getWallet(userId);

        if (getWallet) {
            const {balance, createdAt} = getWallet;

            return new WalletModelDto(balance, createdAt);
        }

        const {balance, createdAt} = await this.walletRepository.create(payload);

        return new WalletModelDto(balance, createdAt);
    }
}

