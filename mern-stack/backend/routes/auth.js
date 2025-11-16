import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body || {};

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ error: { message: "Missing required fields" } });
  }

  if (!["organizer", "volunteer", "admin"].includes(role)) {
    return res.status(400).json({ error: { message: "Invalid role" } });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ error: { message: "Email already registered" } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      role,
    });

    return res.status(201).json({ message: "Account created. Please sign in." });
  } catch (err) {
    console.error("[auth/register] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: { message: "Email and password are required" } });
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("[auth/login] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

export default router;
