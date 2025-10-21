import config from "../config/index.js";
import jwt from "jsonwebtoken";

const GetTokens = (payload) => {

    const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: "15d" });

    return {
        accessToken: "Bearer " + accessToken,
        refreshToken: refreshToken,
    }
}

export default GetTokens;