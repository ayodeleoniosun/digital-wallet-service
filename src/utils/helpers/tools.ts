import bcrypt from "bcryptjs";
import config from "../../config";
import crypto from "crypto";

export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10)
}

export const comparePassword = (password: string, userPassword: string) => {
    return bcrypt.compareSync(password, userPassword);
}

export const generateReference = (): string => {
    return config.transaction.reference_prefix + crypto.randomBytes(12).toString('hex');
}

export const insufficientBalance = (balance: number, amount: number): boolean => {
    return balance < amount;
}

export function toTitleCase(str: string): string {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}