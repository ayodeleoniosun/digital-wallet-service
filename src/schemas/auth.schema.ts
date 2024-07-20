import {validateRequest} from "../middlewares/validator.middleware";
import {NextFunction, Request, Response} from 'express';
import {AuthErrorMessages} from "../utils/enums/messages/authentication/auth.error.messages";

const Joi = require('joi');

export function registrationSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        firstname: Joi.string()
            .min(3)
            .max(20)
            .required()
            .messages({
                "string.empty" : AuthErrorMessages.EMPTY_FIRSTNAME,
                "any.required": AuthErrorMessages.FIRSTNAME_REQUIRED,
                "string.min": AuthErrorMessages.FIRSTNAME_MIN_LEGNTH_ERROR,
                "string.max": AuthErrorMessages.FIRSTNAME_MAX_LEGNTH_ERROR,
            }),
        lastname: Joi.string()
            .min(3)
            .max(20)
            .required()
            .messages({
                "string.empty" : AuthErrorMessages.EMPTY_LASTNAME,
                "any.required": AuthErrorMessages.LASTNAME_REQUIRED,
                "string.min": AuthErrorMessages.LASTNAME_MIN_LEGNTH_ERROR,
                "string.max": AuthErrorMessages.LASTNAME_MAX_LEGNTH_ERROR,
            }),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
            .messages({
                "string.empty" : AuthErrorMessages.EMPTY_EMAIL,
                "any.required": AuthErrorMessages.EMAIL_REQUIRED,
                "string.email": AuthErrorMessages.INVALID_EMAIL_SUPPLIED
            }),
        password: Joi.string()
            .required()
            .min(8)
            .regex(/[A-Z]/, 'upper-case')
            .regex(/[a-z]/, 'lower-case')
            .regex(/[^\w]/, 'special character')
            .regex(/[0-9]/, "number")
            .messages({
                "string.empty" : AuthErrorMessages.EMPTY_PASSWORD,
                "any.required": AuthErrorMessages.PASSWORD_REQUIRED,
                "string.min": AuthErrorMessages.PASSWORD_MIN_LEGNTH_ERROR,
            }),
    });

    validateRequest(req, res, next, schema);
}

export function loginSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .messages({
                "string.empty" : AuthErrorMessages.EMPTY_EMAIL,
                "any.required": AuthErrorMessages.EMAIL_REQUIRED,
            }),
        password: Joi.string()
            .required()
            .messages({
                "string.empty" : AuthErrorMessages.EMPTY_PASSWORD,
                "any.required": AuthErrorMessages.PASSWORD_REQUIRED,
            }),
    });

    validateRequest(req, res, next, schema);
}