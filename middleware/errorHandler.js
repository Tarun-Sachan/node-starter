import config from "../config/index.js";
export const GlobalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
