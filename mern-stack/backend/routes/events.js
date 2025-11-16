import express from "express";
import jwt from "jsonwebtoken";
import { Event } from "../models/Event.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// GET /api/events - list approved events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" }).sort({ date: 1 }).lean();
    return res.json({ events });
  } catch (err) {
    console.error("[events GET /] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

// GET /api/events/:id - event details
// Approved events are visible to all.
// Pending/denied events visible only to owner or admin (if token provided).
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Try to decode token if present to determine owner/admin access
  let requester = null;
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  if (token) {
    try {
      requester = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      requester = null;
    }
  }

  try {
    const event = await Event.findById(id).lean();
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }

    const isApproved = event.status === "approved";
    const isOwner = requester && requester.id && event.owner?.toString() === requester.id;
    const isAdmin = requester?.role === "admin";

    if (!isApproved && !(isOwner || isAdmin)) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }

    return res.json({ event });
  } catch (err) {
    console.error("[events GET /:id] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

// POST /api/events - organizers create pending event
router.post("/", auth, requireRole("organizer"), async (req, res) => {
  const {
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    address,
    capacity,
    imageUrl,
  } = req.body || {};

  if (!title || !description || !category || !date) {
    return res.status(400).json({ error: { message: "Missing required fields" } });
  }

  try {
    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      date: new Date(date),
      startTime,
      endTime,
      address,
      capacity,
      imageUrl,
      status: "pending",
      owner: req.user.id,
    });

    return res.status(201).json({ event });
  } catch (err) {
    console.error("[events POST /] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

export default router;
