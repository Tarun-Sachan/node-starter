import express from "express";
const app = express();
import 'dotenv/config';
const port = process.env.PORT;
import defaultRouter from "./routes/index.js";
import config from "./config/index.js";
import { GlobalErrorHandler } from "./middleware/index.js";
import { connectDB } from "./config/db.js";
import { RequestLogger } from "./middleware/index.js";
import passport from "./config/passport/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

app.use(cors({
    origin: "*",
    credentials: true,
}));

app.use(cookieParser(config.COOKIE_SECRET));
app.use(passport.initialize());
connectDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(RequestLogger)
app.use("/api", defaultRouter);
app.get("/", (req, res) => { res.status(200).send("test successful") })
app.listen(config.PORT, () => {
    console.log(`Server listening on port ${port}`)
})
app.use(GlobalErrorHandler);