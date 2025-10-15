/**
 * Standard success response
 * @param {object} res - Express response object
 * @param {any} data - Response payload
 * @param {string} message - Optional message
 * @param {number} statusCode - Optional HTTP status code
 * @param {object} meta - Optional extra metadata like pagination
 */
import { StatusCodes } from "http-status-codes";
const SuccessResponse = (res, data = {}, message = "success", statusCode = StatusCodes.OK, meta = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        meta,
        timestamp: new Date().toISOString(),
    });
};

export default SuccessResponse;