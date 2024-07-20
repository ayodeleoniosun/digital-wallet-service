import {Router} from "express";
import AuthRoute from "./auth.route";
import WalletRoute from "./wallet.route";

const router = Router();

router.use('/auth', AuthRoute);
router.use('/wallets', WalletRoute);

export default router;