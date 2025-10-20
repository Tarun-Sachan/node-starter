import AppError from "../utils/appError.js";

const Authorize = ({ roles = [], type } = {}) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) return next(new AppError("Unauthorized", 401));

        if (roles.length && !roles.includes(user.role)) {
            return next(new AppError("Forbidden: insufficient role", 403));
        }

        if (type && user.type !== type) {
            return next(new AppError("Forbidden: invalid type", 403));
        }

        next();
    };
};

export default Authorize;
