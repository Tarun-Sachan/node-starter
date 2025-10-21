import jwt from "jsonwebtoken";
import config from "../config/index.js";
import AppError from "../utils/appError.js";
import { StatusCodes } from "http-status-codes";
import { GetTokens } from "../utils/index.js";

const AuthService = {

    SignUp: async (data, Model) => {
        const user = await Model.create(data);
        if (!user) {
            throw new AppError("Error creating user", StatusCodes.BAD_REQUEST);
        }
        return user;
    },

    Login: async (data, Model) => {
        const { email, password } = data;
        try {
            const user = await Model.findOne({ email }).select("+password");
            if (!user) throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

            const isMatch = await user.comparePassword(password);

            if (!isMatch) throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);

            const payload = { id: user.id, email: user.email, role: user.role, type: user.type };

            const { accessToken, refreshToken } = GetTokens(payload);

            // if (user.refreshTokens.length >= 1) {
            //     user.refreshTokens.shift();
            // }

            user.refreshTokens = [refreshToken];
            await user.save();

            return {
                success: true,
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: user.toJSON(),
            }
        } catch (error) {
            throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
        }
    },

    RefreshToken: async (oldToken, Model) => {
        try {
            if (!oldToken) {
                throw new AppError("No refresh token provided", StatusCodes.BAD_REQUEST);
            }
            const decoded = jwt.verify(oldToken, config.JWT_REFRESH_SECRET);
            const { email } = decoded;

            const user = await Model.findOne({ email }).select("+password");
            if (!user) {
                throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
            }
            const isTokenValid = user.refreshTokens.includes(oldToken);
            if (!isTokenValid) {
                throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
            }
            const payload = { id: user.id, email: user.email, role: user.role, type: user.type };

            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = GetTokens(payload);

            user.refreshTokens = user.refreshTokens.filter(t => t !== oldToken);
            user.refreshTokens.push(newRefreshToken);
            await user.save();

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            }
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError("Refresh token expired", StatusCodes.UNAUTHORIZED);
            } else if (error.name === "JsonWebTokenError") {
                throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
            } else {
                throw new AppError(error.message || "Logout failed", StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
    },

    Logout: async (refreshToken, Model) => {
        try {
            if (!refreshToken) {
                throw new AppError("No refresh token provided", StatusCodes.BAD_REQUEST);
            }

            const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
            const user = await Model.findById(decoded.id);
            if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

            const tokenExists = user.refreshTokens.includes(refreshToken);
            if (!tokenExists) {
                throw new AppError("Invalid or expired refresh token", StatusCodes.UNAUTHORIZED);
            }

            user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            await user.save();

            return { success: true, message: "Logged out successfully" };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError("Refresh token expired", StatusCodes.UNAUTHORIZED);
            } else if (error.name === "JsonWebTokenError") {
                throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
            } else {
                throw new AppError(error.message || "Logout failed", StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
    },

    LogoutAll: async (refreshToken, Model) => {
        try {
            if (!refreshToken) {
                throw new AppError("No refresh token provided", StatusCodes.BAD_REQUEST);
            }
            const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
            const user = await Model.findById(decoded.id);

            if (!user) throw new AppError("User not found", StatusCodes.NOT_FOUND);

            const tokenExists = user.refreshTokens.includes(refreshToken);
            if (!tokenExists) {
                throw new AppError("Invalid or expired refresh token", StatusCodes.UNAUTHORIZED);
            }

            user.refreshTokens = [];
            await user.save();

            return { success: true, message: "Logged out successfully from all devices" };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new AppError("Refresh token expired", StatusCodes.UNAUTHORIZED);
            } else if (error.name === "JsonWebTokenError") {
                throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
            } else {
                throw new AppError(error.message || "Logout failed", StatusCodes.INTERNAL_SERVER_ERROR);
            }
        }
    }
}

export default AuthService;