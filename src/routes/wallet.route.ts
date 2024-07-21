import {Router} from 'express';
import {WalletRepository} from "../repositories/wallet/wallet.repository";
import {WalletService} from "../services/wallet.service";
import {WalletController} from "../controllers/wallet.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {Jwt} from "../utils/helpers/jwt";
import {DepositRepository} from "../repositories/wallet/deposit.repository";

const authRepository = new AuthRepository();
const jwt = new Jwt();
const authMiddleware = new AuthMiddleware(authRepository, jwt);

const walletRepository = new WalletRepository();
const depositRepository = new DepositRepository();
const walletService = new WalletService(walletRepository, depositRepository);
const walletController = new WalletController(walletService);

const router: Router = Router();

router.get('/', authMiddleware.authenticate, walletController.getWallet);
router.post('/fund', authMiddleware.authenticate, walletController.fundWallet);

export default router;