import {WalletRepository} from "../../repositories/wallet/wallet.repository";
import {DepositModelDto} from "../../dtos/models/wallet/deposit.model";
import HttpException from "../../utils/exceptions/http.exception";
import {WalletErrorMessages} from "../../utils/enums/messages/wallet/wallet.error.messages";
import * as HttpStatus from 'http-status';
import {DepositRepository} from "../../repositories/wallet/deposit.repository";
import {databaseService} from "../../utils/database";
import {RedisService} from "../redis.service";
import {Service} from "typedi";
import {IFundWallet} from "../../interfaces/wallet/fund.wallet.interface";
import {FundWalletRequestDto} from "../../dtos/requests/wallet/fund.wallet.request.dto";

@Service()
export class DepositService {
    constructor(
        public walletRepository: WalletRepository,
        public depositRepository: DepositRepository,
        public redisService: RedisService
    ) {
    }

    async depositAlreadyCompleted(reference: string): Promise<boolean> {
        const checkFundedInDB = await this.depositRepository.getDepositByReference(reference);

        const checkFundedInRedis = await this.redisService.get('fund-reference:' + reference);

        return !!(checkFundedInDB || checkFundedInRedis);
    }

    async execute(userId: number, payload: FundWalletRequestDto): Promise<DepositModelDto> {
        const {reference, amount} = payload;

        const getWallet = await this.walletRepository.getWallet(userId);

        if (!getWallet) {
            throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const depositAlreadyCompleted = await this.depositAlreadyCompleted(reference);

        if (depositAlreadyCompleted) {
            throw new HttpException(WalletErrorMessages.DEPOSIT_ALREADY_DONE, HttpStatus.BAD_REQUEST);
        }

        try {
            return await databaseService.sequelize.transaction(async transaction => {
                const wallet = await this.walletRepository.lockWalletForUpdate(userId, transaction);

                if (!wallet) {
                    throw new HttpException(WalletErrorMessages.WALLET_NOT_FOUND, HttpStatus.NOT_FOUND);
                }

                payload.userId = userId;

                const deposit = await this.depositRepository.create(payload as IFundWallet, {transaction: transaction});

                await this.walletRepository.incrementBalance(wallet, amount, transaction);

                this.redisService.set('fund-reference:' + reference, reference);

                return new DepositModelDto(deposit);
            });

        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

