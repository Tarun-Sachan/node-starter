import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import UserAuthController from "../controller/user/user.auth.controller.js";
import { ValidateRequest } from "../middleware/index.js"
import { UserAuthSchema } from "../validation/index.js";
import AppError from "../utils/appError.js";

router.get("/test", asyncHandler(async (req, res) => {
    const data = await Promise.reject("User async route");
    res.send(data);
})
);

router.post("/login", ValidateRequest(UserAuthSchema.Login, "body"), asyncHandler(UserAuthController.Login));
export default router;