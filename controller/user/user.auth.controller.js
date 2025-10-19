import { StatusCodes } from "http-status-codes";
import { CONST_MESSAGES } from "../../helper/index.js";
import { SuccessResponse } from "../../utils/index.js";
import UserService from "../../service/user.service.js";
const UserAuthController = {

    Login: async (req, res) => {
        const data = await UserService.Login(req.body)
        SuccessResponse(res, data, CONST_MESSAGES.SUCCESS, StatusCodes.OK);
    }
}

export default UserAuthController;