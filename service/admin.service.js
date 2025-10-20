import { AdminUser } from "../models/index.js";
import AppError from "../utils/appError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
const UserService = {
    Login: async (data) => {
        const { email, password } = data;

        try {
            const user = await AdminUser.findOne({ email }).select("+password");
            if (!user) throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

            const isMatch = await user.comparePassword(password);
            if (!isMatch) throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

            const payload = { id: user.id, email: user.email, role: user.role };

            const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1d" });

            return {
                success: true,
                token: "Bearer " + token,
                user: user.toJSON(),
            };
        } catch (err) {
            throw new AppError(err.message, err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
        }
    },
    Signup: async (data) => {
        const user = await AdminUser.create(data);
        if (!user) {
            throw new AppError("Error creating user", StatusCodes.BAD_REQUEST);
        }

        return user
    },
};

export default UserService;
