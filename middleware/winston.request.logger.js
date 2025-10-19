import logger from "../utils/winston.logger.js";
import config from "../config/index.js";

const RequestLogger = (req, res, next) => {
    const ip = req.ip === "::1" ? "127.0.0.1" : req.ip;
    const baseLog = `${req.method} ${req.path} - ${ip}`;
    if (config.NODE_ENV === "development") {
        const query = Object.keys(req.query).length ? ` | Query: ${JSON.stringify(req.query)}` : "";
        const body = Object.keys(req.body || {}).length ? ` | Body: ${JSON.stringify(req.body)}` : "";
        logger.info(baseLog + query + body);
    } else {
        logger.info(baseLog);
    }

    next();
};

export default RequestLogger;
