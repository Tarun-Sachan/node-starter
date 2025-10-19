import AppError from "../utils/appError.js";
import config from "../config/index.js";
import logger from "../utils/winston.logger.js";
import { StatusCodes } from "http-status-codes";

export const GlobalErrorHandler = (err, req, res, next) => {
    // Log error
    logger.error(err.stack || err.message);

    let error = err; // use original error

    //  Handle Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value: ${field}`;
        error = new AppError(message, StatusCodes.BAD_REQUEST);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message);
        error = new AppError(messages.join(", "), StatusCodes.BAD_REQUEST);
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        error = new AppError(message, StatusCodes.BAD_REQUEST);
    }

    //  Joi validation errors
    if (err.name === "JoiValidationError") {
        error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
        error.status = "fail";
    }

    //  Fallback unknown errors
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const status = error.status || "error";

    res.status(statusCode).json({
        success: false,
        status,
        message: error.message,
        ...(error.details && { details: error.details }),
        ...(config.NODE_ENV === "development" && { stack: err.stack }),
    });
};
