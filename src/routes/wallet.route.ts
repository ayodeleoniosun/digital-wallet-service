import { Router } from 'express';
import {WalletRepository} from "../repositories/wallet/wallet.repository";
import {WalletService} from "../services/wallet.service";
import {WalletController} from "../controllers/wallet.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {Jwt} from "../utils/helpers/jwt";

const authRepository = new AuthRepository();
const jwt = new Jwt();
const authMiddleware = new AuthMiddleware(authRepository, jwt);

const walletRepository = new WalletRepository();
const walletService = new WalletService(walletRepository);
const walletController = new WalletController(walletService);

const router: Router = Router();

router.get('/', authMiddleware.authenticate, walletController.getWallet);

export default router;