import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 10)
}

export const comparePassword = (password: string, userPassword: string) => {
    return bcrypt.compareSync(password, userPassword);
}

export function toTitleCase(str: string): string {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}