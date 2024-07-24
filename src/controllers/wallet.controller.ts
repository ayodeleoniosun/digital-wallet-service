import {Request, Response} from 'express';
import {ResponseDto} from "../dtos/responses/response.dto";
import * as HttpStatus from 'http-status';
import {WalletSuccessMessages} from "../utils/enums/messages/wallet/wallet.success.messages";
import {Body, CurrentUser, Get, JsonController, Post, Res} from "routing-controllers";
import {Container, Service} from "typedi";
import {User} from "../database/models/user";
import {ValidationService} from "../services/validation.service";
import {WalletService} from "../services/wallet/wallet.service";
import {DepositService} from "../services/wallet/deposit.service";
import {WithdrawalService} from "../services/wallet/withdrawal.service";
import {TransferService} from "../services/wallet/transfer.service";
import {FundWalletRequestDto} from "../dtos/requests/wallet/fund.wallet.request.dto";
import {DebitWalletRequestDto} from "../dtos/requests/wallet/debit.wallet.request.dto";
import {TransferRequestDto} from "../dtos/requests/wallet/transfer.request.dto";
import {debitWalletSchema, fundWalletSchema, transferSchema} from "../schemas/wallet.schema";

@JsonController('/wallets')
@Service()
export class WalletController {
    public depositService = Container.get(DepositService);
    public withdrawalService = Container.get(WithdrawalService);
    public transferService = Container.get(TransferService);
    public validationService = Container.get(ValidationService);
    public walletService = Container.get(WalletService);

    @Get('/')
    async getWallet(@Body() req: Request, @Res() res: Response, @CurrentUser() user?: User) {
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
    async fund(@Body() fundWalletRequestDto: FundWalletRequestDto, @Res() res: Response, @CurrentUser() user?: User) {
        try {
            this.validationService.validatePayload(fundWalletRequestDto, fundWalletSchema());

            const wallet = await this.depositService.execute(user.id, fundWalletRequestDto);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.FUND_WALLET_SUCCESSFUL, wallet);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/withdraw')
    async debit(@Body() debitWalletRequestDto: DebitWalletRequestDto, @Res() res: Response, @CurrentUser() user?: User) {
        try {
            this.validationService.validatePayload(debitWalletRequestDto, debitWalletSchema());

            const wallet = await this.withdrawalService.execute(user.id, debitWalletRequestDto);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.DEBIT_WALLET_SUCCESSFUL, wallet);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    @Post('/transfer')
    async transfer(@Body() transferRequestDto: TransferRequestDto, @Res() res: Response, @CurrentUser() user?: User) {
        try {
            this.validationService.validatePayload(transferRequestDto, transferSchema());

            const transfer = await this.transferService.execute(user.id, transferRequestDto);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.TRANSFER_SUCCESSFUL, transfer);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}