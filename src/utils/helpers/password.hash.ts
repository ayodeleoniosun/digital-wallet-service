import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => {
    return bcrypt.hashSync(password, 10)
}

export const comparePassword = (password: string, userPassword: string) => {
    return bcrypt.compareSync(password, userPassword);
}