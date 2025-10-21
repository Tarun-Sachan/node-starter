const config = {
    PORT: process.env.PORT || 3001,
    NODE_ENV: process.env.NODE_ENV || "development",
    DB_URL: process.env.DB_URL,
    VERSION: process.env.VERSION || "v1",
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
};

export default config;