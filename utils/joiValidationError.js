import AppError from './appError.js';
import { StatusCodes } from 'http-status-codes';

export default class JoiValidationError extends AppError {

    constructor(messages) {
        const message = Array.isArray(messages) ? messages.join(", ") : messages;
        super(message, StatusCodes.UNPROCESSABLE_ENTITY);
        this.name = "JoiValidationError";
        this.details = messages;
    }
}
