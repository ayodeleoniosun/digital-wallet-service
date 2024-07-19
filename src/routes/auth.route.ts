import { Router } from 'express';
import {AuthController} from "../controllers/auth.controller";
import {AuthService} from "../services/auth.service";
import {AuthRepository} from "../repositories/auth.repository";
import {registrationSchema, loginSchema} from "../schemas/auth.schema";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const router: Router = Router();

router.post('/register', registrationSchema, authController.register);
router.post('/login', loginSchema, authController.login);

export default router;