import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.APP_PORT,
    jwt_secret: process.env.JWT_SECRET,
    redis_uri: process.env.REDIS_ENDPOINT_URI,
    database: {
        name: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    },
    email: {
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        from_address: process.env.MAIL_FROM_ADDRESS
    },
    transaction: {
        reference_prefix: process.env.TRANSACTION_REFERENCE_PREFIX,
        minimum_amount: process.env.MINIMUM_AMOUNT,
        minimum_fee: process.env.MINIMUM_FEE
    }
}