import {validateRequest} from "../middlewares/validator.middleware";
import {NextFunction, Request, Response} from 'express';
import {WalletErrorMessages} from "../utils/enums/messages/wallet/wallet.error.messages";
import {SourceType} from "../dtos/models/wallet/deposit.model";

const Joi = require('joi');

export function fundWalletSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        source: Joi.string()
            .required()
            .valid(...Object.values(SourceType))
            .messages({
                "string.empty": WalletErrorMessages.SOURCE_CANNOT_BE_EMPTY,
                "any.required": WalletErrorMessages.SOURCE_REQUIRED,
                "any.only": WalletErrorMessages.SOURCE_VALID_VALUES,
            }),
        amount: Joi.number()
            .required()
            .positive()
            .min(10)
            .messages({
                "string.empty": WalletErrorMessages.AMOUNT_CANNOT_BE_EMPTY,
                "any.required": WalletErrorMessages.AMOUNT_REQUIRED,
                "number.positive": WalletErrorMessages.AMOUNT_MUST_BE_POSITIVE,
                "number.min": WalletErrorMessages.MINIMUM_AMOUNT,
            }),
        reference: Joi.string()
            .required()
            .messages({
                "string.empty": WalletErrorMessages.REFERENCE_CANNOT_BE_EMPTY,
                "any.required": WalletErrorMessages.REFERENCE_REQUIRED,
            }),
        account_number: Joi.string()
            .length(10)
            .messages({
                "string.empty": WalletErrorMessages.ACCOUNT_NUMBER_CANNOT_BE_EMPTY,
                "string.length": WalletErrorMessages.ACCOUNT_NUMBER_LENGTH
            }),
        account_name: Joi.string()
            .messages({
                "string.empty": WalletErrorMessages.ACCOUNT_NAME_CANNOT_BE_EMPTY,
            }),
        bank_name: Joi.string()
            .messages({
                "string.empty": WalletErrorMessages.BANK_NAME_CANNOT_BE_EMPTY,
            }),
        last_4_digits: Joi.string()
            .length(4)
            .messages({
                "string.empty": WalletErrorMessages.LAST_4_DIGITS_CANNOT_BE_EMPTY,
                "string.length": WalletErrorMessages.LAST_4_DIGITS_LENGTH
            }),
        auth_token: Joi.string()
            .messages({
                "string.empty": WalletErrorMessages.AUTH_TOKEN_CANNOT_BE_EMPTY,
            }),

    });

    validateRequest(req, res, next, schema);
}