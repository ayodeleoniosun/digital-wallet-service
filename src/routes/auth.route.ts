import { Router } from 'express';
import {AuthController} from "../controllers/auth.controller";
import {AuthService} from "../services/auth.service";
import {AuthRepository} from "../repositories/authentication/auth.repository";
import {registrationSchema, loginSchema} from "../schemas/auth.schema";
import {Jwt} from "../utils/helpers/jwt";

const authRepository = new AuthRepository();
const jwt = new Jwt();
const authService = new AuthService(authRepository, jwt);
const authController = new AuthController(authService);

const router: Router = Router();

router.post('/register', registrationSchema, authController.register);
router.post('/login', loginSchema, authController.login);

export default router;