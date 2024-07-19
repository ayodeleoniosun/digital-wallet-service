export class ResponseDto {
    success: boolean;
    message: string;
    data: any;

    constructor(success: boolean, message: string, data: any = null) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}