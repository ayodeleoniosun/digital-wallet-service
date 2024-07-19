import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    database: {
        name: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    },
}