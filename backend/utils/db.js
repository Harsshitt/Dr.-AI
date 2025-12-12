
import mongoose from 'mongoose';
import User from '../models/User.js';
import UserMock from '../models/UserMock.js';

let useMock = false;

export const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dr-ai";
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB connected successfully");
        useMock = false;
    } catch (err) {
        console.log("⚠️ MongoDB connection failed. Switching to MOCK DATABASE mode.");
        console.log("   Reason:", err.message);
        useMock = true;
    }
};

export const getUserModel = () => {
    if (useMock || mongoose.connection.readyState !== 1) {
        console.log("[DB] Using Mock User Model");
        return UserMock;
    }
    return User;
};
