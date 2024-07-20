import { Router } from 'express';
import {WalletRepository} from "../repositories/wallet/wallet.repository";
import {WalletService} from "../services/wallet.service";
import {WalletController} from "../controllers/wallet.controller";

const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

const router: Router = Router();

router.get('/', walletController.getWallet);

export default router;