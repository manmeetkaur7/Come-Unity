import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js";
import eventsRouter from "./routes/events.js";

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

connectDB();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// TODO: wire up /api/admin routes here
app.use("/api/auth", authRouter);
app.use("/api/events", eventsRouter);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
