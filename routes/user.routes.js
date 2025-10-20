import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import UserAuthController from "../controller/user/user.auth.controller.js";
import { ValidateRequest } from "../middleware/index.js"
import { UserAuthSchema } from "../validation/index.js";
import AppError from "../utils/appError.js";
import passport from "passport";

router.get("/test", asyncHandler(async (req, res) => {
    const data = await Promise.reject("User async route");
    res.send(data);
})
);

router.post("/login", ValidateRequest(UserAuthSchema.Login, "body"), asyncHandler(UserAuthController.Login));
router.post("/signup", ValidateRequest(UserAuthSchema.Signup, "body"), asyncHandler(UserAuthController.Signup));
router.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req)
    res.json({
        success: true,
        user: req.user, // user info from JWT
    })
});
export default router;