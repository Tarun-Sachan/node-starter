import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";

router.get("/test", asyncHandler(async (req, res) => {
    const data = await Promise.resolve("Admin async route");
    res.send(data);
})
);

export default router;