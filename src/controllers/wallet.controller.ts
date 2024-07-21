import {Request, Response} from 'express';
import {WalletService} from "../services/wallet.service";
import {ResponseDto} from "../dtos/responses/response.dto";
import * as HttpStatus from 'http-status';
import {WalletSuccessMessages} from "../utils/enums/messages/wallet/wallet.success.messages";
import {FundWalletRequestDto} from "../dtos/requests/wallet/fund.wallet.request.dto";

export class WalletController {
    public constructor(private walletService: WalletService) {
    }

    getWallet = async (req: Request, res: Response) => {
        try {
            const wallet = await this.walletService.getUserWallet(req.user.id);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.WALLET_RETRIEVED, wallet);

            return res.status(HttpStatus.OK).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }

    fundWallet = async (req: Request, res: Response) => {
        try {
            const wallet = await this.walletService.fund(req.user.id, req.body as FundWalletRequestDto);

            const successResponse = new ResponseDto(true, WalletSuccessMessages.FUND_WALLET_SUCCESSFUL, wallet);

            return res.status(HttpStatus.CREATED).json(successResponse);
        } catch (error: any) {
            const errorResponse = new ResponseDto(false, error.message);

            return res.status(error.statusCode ?? HttpStatus.BAD_REQUEST).json(errorResponse);
        }
    }
}