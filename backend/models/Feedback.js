import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    ratingUI: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    ratingChatbot: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    ratingOverall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    userEmail: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
