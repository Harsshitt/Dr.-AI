// Backend/index.js (ESM version)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import authRoutes from "./routers/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Mongo connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Dr.AI backend is running");
});

// API ROUTE (placeholder for future AI chat)
app.post("/api/chat", (req, res) => {
  return res.json({
    ok: true,
    message: "Backend received your request",
    received: req.body || null,
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Dr.AI backend listening on http://localhost:${PORT}`);
});
