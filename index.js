import express from "express";
const app = express();
import 'dotenv/config';
const port = process.env.PORT;
import defaultRouter from "./routes/index.js";
import config from "./config/index.js";
app.use("/api", defaultRouter);
import { GlobalErrorHandler } from "./middleware/index.js";
import { connectDB } from "./config/db.js";
connectDB();
app.listen(config.PORT, () => {
    console.log(`Server listening on port ${port}`)
})

app.use(GlobalErrorHandler);