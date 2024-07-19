import AuthRoute from "./auth.route";
import {Router} from "express";

const router = Router();

router.use('/auth', AuthRoute);

export default router;