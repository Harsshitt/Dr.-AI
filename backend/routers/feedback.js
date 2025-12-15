import express from "express";
import Feedback from "../models/Feedback.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res) => {
    try {
        const { ratingUI, ratingChatbot, ratingOverall, comment } = req.body;

        // Basic Validation
        if (!ratingUI || !ratingChatbot || !ratingOverall) {
            return res.status(400).json({ error: "Please provide ratings for all categories." });
        }

        // Optional: Extract user email from token if logged in
        let userEmail = null;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.split(" ")[1];
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
                    userEmail = decoded.email;
                }
            } catch (e) {
                // Ignore token errors, feedback can be anonymous or we just don't capture email
            }
        }

        const newFeedback = new Feedback({
            ratingUI,
            ratingChatbot,
            ratingOverall,
            comment,
            userEmail
        });

        await newFeedback.save();

        res.status(201).json({ message: "Feedback submitted successfully!" });
    } catch (err) {
        console.error("Error saving feedback:", err);
        res.status(500).json({ error: "Server error while saving feedback." });
    }
});

export default router;
