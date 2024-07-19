import * as HttpStatus from 'http-status';

class HttpException extends Error {
    message: string;
    statusCode: number;

    constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}

export default HttpException;