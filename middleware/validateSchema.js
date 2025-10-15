import Joi from "joi";
import { StatusCodes } from "http-status-codes";
/**
 * Middleware to validate request body, query, or params
 * @param {Joi.ObjectSchema} schema - Joi schema
 * @param {"body"|"query"|"params"} property - Which part of request to validate
 */


const ValidateRequest = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], { abortEarly: false });

        if (!error) return next();

        const messages = error.details.map((d) => d.message).join(", ");
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            success: false,
            message: messages,
        });
    };
};

export default ValidateRequest;
