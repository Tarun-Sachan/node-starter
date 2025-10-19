import AppError from "../utils/appError.js";
import { StatusCodes } from "http-status-codes";
const UserService = {
    Login: async (data) => {
        const { email, password } = data;
        if (email !== "user@gmail.com" || password !== "12345") {
            throw new AppError("User not found", StatusCodes.BAD_REQUEST);
        }

        return {
            token: "thisisyoursecuretoken",
        };
    },
};

export default UserService;
