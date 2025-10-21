import { StatusCodes } from "http-status-codes";
import { CONST_MESSAGES } from "../../helper/index.js";
import { SuccessResponse } from "../../utils/index.js";
import AuthService from "../../service/auth.service.js";
import { AdminUser } from "../../models/index.js";
import config from "../../config/index.js";
const AdminUserAuthController = {

    Login: async (req, res) => {
        const data = await AuthService.Login(req.body, AdminUser)

        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            signed: true,
        });
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS);
    },
    SignUp: async (req, res) => {
        const data = await AuthService.SignUp(req.body, AdminUser)
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS,);
    },
    Logout: async (req, res) => {
        const data = await AuthService.Logout(req.signedCookies.refreshToken, AdminUser);
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS,);
    },
    LogoutAll: async (req, res) => {
        const data = await AuthService.LogoutAll(req.signedCookies.refreshToken, AdminUser)
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS,);
    },
    RefreshToken: async (req, res) => {
        const data = await AuthService.RefreshToken(req.signedCookies.refreshToken, AdminUser);
        res.cookie("refreshToken", data.refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
            signed: true,
        });
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS);
    }
}

export default AdminUserAuthController;