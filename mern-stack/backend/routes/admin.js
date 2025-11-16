import express from "express";
import { Event } from "../models/Event.js";
import { auth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// POST /api/admin/events/:id/approve
router.post("/events/:id/approve", auth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    event.status = "approved";
    await event.save();
    return res.json({ event });
  } catch (err) {
    console.error("[admin approve] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

// POST /api/admin/events/:id/deny
router.post("/events/:id/deny", auth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: { message: "Event not found" } });
    }
    event.status = "denied";
    await event.save();
    return res.json({ event });
  } catch (err) {
    console.error("[admin deny] error", err);
    return res.status(500).json({ error: { message: "Server error" } });
  }
});

export default router;
