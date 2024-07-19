import {validateRequest} from "../middlewares/validator.middleware";
import {NextFunction, Request, Response} from 'express';
import {ErrorMessages} from "../utils/enums/error.messages";

const Joi = require('joi');

export function registrationSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        firstname: Joi.string()
            .min(3)
            .max(20)
            .required()
            .messages({
                "string.empty" : ErrorMessages.EMPTY_FIRSTNAME,
                "any.required": ErrorMessages.FIRSTNAME_REQUIRED,
                "string.min": ErrorMessages.FIRSTNAME_MIN_LEGNTH_ERROR,
                "string.max": ErrorMessages.FIRSTNAME_MAX_LEGNTH_ERROR,
            }),
        lastname: Joi.string()
            .min(3)
            .max(20)
            .required()
            .messages({
                "string.empty" : ErrorMessages.EMPTY_LASTNAME,
                "any.required": ErrorMessages.LASTNAME_REQUIRED,
                "string.min": ErrorMessages.LASTNAME_MIN_LEGNTH_ERROR,
                "string.max": ErrorMessages.LASTNAME_MAX_LEGNTH_ERROR,
            }),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required()
            .messages({
                "string.empty" : ErrorMessages.EMPTY_EMAIL,
                "any.required": ErrorMessages.EMAIL_REQUIRED,
                "string.email": ErrorMessages.INVALID_EMAIL_SUPPLIED
            }),
        password: Joi.string()
            .required()
            .min(8)
            .regex(/[A-Z]/, 'upper-case')
            .regex(/[a-z]/, 'lower-case')
            .regex(/[^\w]/, 'special character')
            .regex(/[0-9]/, "number")
            .messages({
                "string.empty" : ErrorMessages.EMPTY_PASSWORD,
                "any.required": ErrorMessages.PASSWORD_REQUIRED,
                "string.min": ErrorMessages.PASSWORD_MIN_LEGNTH_ERROR,
            }),
    });

    validateRequest(req, res, next, schema);
}

export function loginSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        email: Joi.string()
            .required()
            .messages({
                "string.empty" : ErrorMessages.EMPTY_EMAIL,
                "any.required": ErrorMessages.EMAIL_REQUIRED,
            }),
        password: Joi.string()
            .required()
            .messages({
                "string.empty" : ErrorMessages.EMPTY_PASSWORD,
                "any.required": ErrorMessages.PASSWORD_REQUIRED,
            }),
    });

    validateRequest(req, res, next, schema);
}