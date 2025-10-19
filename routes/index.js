import express from "express";
const router = express.Router();
import UserRoutes from "./user.routes.js";
import AdminRoutes from "./admin.routes.js";
const VERSION = process.env.VERSION;

const defaultRouters = [
    {
        path: `/${VERSION}/user`,
        route: UserRoutes
    },
    {
        path: `/${VERSION}/admin`,
        route: AdminRoutes
    },
]

defaultRouters.map((route) => {
    router.use(route.path, route.route)
});

export default router;

