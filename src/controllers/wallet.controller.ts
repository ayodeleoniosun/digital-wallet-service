import {Request, Response} from 'express';
import {WalletService} from "../services/wallet.service";
import {ResponseDto} from "../dtos/responses/response.dto";
import * as HttpStatus from 'http-status';
import {WalletSuccessMessages} from "../utils/enums/messages/wallet/wallet.success.messages";

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
}