import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Event } from "../models/Event.js";

dotenv.config();

const seedUsers = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    password: "pw12345",
  },
  {
    firstName: "Organizer",
    lastName: "User",
    email: "organizer@example.com",
    role: "organizer",
    password: "pw12345",
  },
  {
    firstName: "Volunteer",
    lastName: "User",
    email: "volunteer@example.com",
    role: "volunteer",
    password: "pw12345",
  },
];

const seedEvents = (ownerId) => [
  {
    title: "Community Garden Cleanup",
    description: "Help tidy and prep the garden beds for spring.",
    category: "Volunteer",
    date: new Date("2025-03-10"),
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    address: "3415 Martin Luther King Jr Blvd, Sacramento, CA",
    capacity: 30,
    imageUrl: "",
    status: "approved",
    owner: ownerId,
  },
  {
    title: "Health & Wellness Fair",
    description: "Free screenings and nutrition workshops for families.",
    category: "Health",
    date: new Date("2025-04-05"),
    startTime: "10:00 AM",
    endTime: "02:00 PM",
    address: "123 Main St, Sacramento, CA",
    capacity: 100,
    imageUrl: "",
    status: "approved",
    owner: ownerId,
  },
  {
    title: "STEM Night",
    description: "Hands-on STEM activities for kids and parents.",
    category: "Education",
    date: new Date("2025-05-15"),
    startTime: "06:00 PM",
    endTime: "08:30 PM",
    address: "Oak Ridge Elementary, Sacramento, CA",
    capacity: 50,
    imageUrl: "",
    status: "pending",
    owner: ownerId,
  },
];

async function run() {
  try {
    await connectDB();

    // Optional clean-up of just the seeded emails/titles to avoid duplicates
    await User.deleteMany({ email: { $in: seedUsers.map((u) => u.email.toLowerCase()) } });

    const createdUsers = [];
    for (const user of seedUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const doc = await User.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email.toLowerCase(),
        role: user.role,
        passwordHash,
      });
      createdUsers.push(doc);
    }

    const organizer = createdUsers.find((u) => u.role === "organizer");
    if (!organizer) {
      throw new Error("Organizer user not created; cannot seed events.");
    }

    // Clean up only events with these titles to avoid duplicating seeds
    const titles = ["Community Garden Cleanup", "Health & Wellness Fair", "STEM Night"];
    await Event.deleteMany({ title: { $in: titles } });
    await Event.insertMany(seedEvents(organizer._id));

    console.log("Seed complete.");
    console.log("Users created:");
    createdUsers.forEach((u) => {
      console.log(`- ${u.email} (${u.role}) password: pw12345`);
    });
    console.log("Events created: Community Garden Cleanup, Health & Wellness Fair, STEM Night");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

run();
