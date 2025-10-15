import mongoose from 'mongoose';
import config from './index.js';
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.DB_URL, {
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};
