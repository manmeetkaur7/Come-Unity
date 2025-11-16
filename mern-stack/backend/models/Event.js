import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: false, trim: true }, // e.g., "09:00 AM"
    endTime: { type: String, required: false, trim: true }, // e.g., "12:00 PM"
    address: { type: String, required: false, trim: true },
    capacity: { type: Number, required: false },
    imageUrl: { type: String, required: false, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
      required: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
