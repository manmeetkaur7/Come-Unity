import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db.js";
connectDB();

const app = express();

app.get("/products", (req, res) => {
  res.send("Server is ready");
});

app.listen(5001, () => {
  console.log("Server started at http://localhost:5001");
});
