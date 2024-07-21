import {Request, Response} from 'express';
import {ResponseDto} from "../dtos/responses/response.dto";
import * as HttpStatus from 'http-status';
import {WalletSuccessMessages} from "../utils/enums/messages/wallet/wallet.success.messages";
import {FundWalletRequestDto} from "../dtos/requests/wallet/fund.wallet.request.dto";
import {Body, CurrentUser, Get, JsonController, Post, Res} from "routing-controllers";
import {Service} from "typedi";
import {User} from "../database/models/user";
import {ValidationService} from "../utils/validations/validation.service";
import {WalletService} from "../services/wallet.service";
import {DepositService} from "../services/deposit.service";
import {WithdrawalService} from "../services/withdrawal.service";
import {DebitWalletRequestDto} from "../dtos/requests/wallet/debit.wallet.request.dto";

@JsonController('/wallets')
@Service()
export class WalletController {
    public constructor(
        private depositService: DepositService,
        private withdrawalService: WithdrawalService,
        private walletService: WalletService,
        public validationService: ValidationService) {
    }

    @Get('/')
    async getWallet(@CurrentUser() user?: User, @Body() req: Request, @Res() res: Response) {
        try {
            const wallet = await this.walletService.getUserWallet(user.id);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.WALLET_RETRIEVED, wallet);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/fund')
    async fundWallet(@CurrentUser() user?: User, @Body() fundWalletRequestDto: FundWalletRequestDto, @Res() res: Response) {
        try {
            this.validationService.validatePayload(fundWalletRequestDto, 'fund-wallet');

            const wallet = await this.depositService.execute(user.id, fundWalletRequestDto);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.FUND_WALLET_SUCCESSFUL, wallet);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/withdraw')
    async debitWallet(@CurrentUser() user?: User, @Body() debitWalletRequestDto: DebitWalletRequestDto, @Res() res: Response) {
        try {
            this.validationService.validatePayload(debitWalletRequestDto, 'debit-wallet');

            const wallet = await this.withdrawalService.execute(user.id, debitWalletRequestDto);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.DEBIT_WALLET_SUCCESSFUL, wallet);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}