import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import { ValidateRequest, Authorize } from "../middleware/index.js";
import { AdminUserAuthSchema } from "../validation/index.js";
import AdminAuthController from "../controller/admin/admin.auth.controller.js";
import passport from "passport";
router.get("/test", asyncHandler(async (req, res) => {
    const data = await Promise.resolve("Admin async route");
    res.send(data);
})
);
router.post("/signup", ValidateRequest(AdminUserAuthSchema.Signup, "body"), asyncHandler(AdminAuthController.SignUp));
router.post("/login", ValidateRequest(AdminUserAuthSchema.Login, "body"), asyncHandler(AdminAuthController.Login));
router.get("/refresh", passport.authenticate("jwt", { session: false }), asyncHandler(AdminAuthController.RefreshToken));
router.get("/logout", passport.authenticate("jwt", { session: false }), asyncHandler(AdminAuthController.Logout));
router.get("/logoutAll", passport.authenticate("jwt", { session: false }), asyncHandler(AdminAuthController.LogoutAll));
router.get("/profile", passport.authenticate("jwt", { session: false }), Authorize({ roles: ["admin"], type: "internal" }), (req, res) => {
    console.log(req.signedCookies.refreshToken)
    return res.json({ success: true, user: req.user })
});

export default router;