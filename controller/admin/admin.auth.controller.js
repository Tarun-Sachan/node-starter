import { StatusCodes } from "http-status-codes";
import { CONST_MESSAGES } from "../../helper/index.js";
import { SuccessResponse } from "../../utils/index.js";
import AdminService from "../../service/admin.service.js";
const AdminUserAuthController = {

    Login: async (req, res) => {
        const data = await AdminService.Login(req.body)
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS);
    },
    Signup: async (req, res) => {
        const data = await AdminService.Signup(req.body)
        SuccessResponse(res, data, StatusCodes.OK, CONST_MESSAGES.SUCCESS,);
    }
}

export default AdminUserAuthController;