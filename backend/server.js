// ==============================
// IMPORTING LIBRARIES
// ==============================

const express = require("express");

// Path helps safely build file paths (so they work on Windows/Mac/Linux)
const path = require("path");

// mongoose is a library that helps node.js talk to MongoDB
const mongoose = require("mongoose");

// dotenv REMOVED (you said to delete dotenv)
// require("dotenv").config();


// ==============================
// BASIC SERVER SETUP
// ==============================

const app = express();      // create the Express app
const PORT = 8080;          // server will run on localhost:8080


// This allows the server to read JSON data sent from the frontend
// Example: when a form sends JSON
app.use(express.json());

// This allows the server to read regular form data (like <form method="POST">)
app.use(express.urlencoded({ extended: true }));

// This tells Express to serve static files (HTML, CSS, JS) from /public
// So when visiting "/", it can load home.html, etc.
app.use(express.static(path.join(__dirname, "../frontend/public")));




// ==============================
// CONNECTING TO MONGODB
// ==============================

// This connects to a MongoDB database running locally.
mongoose.connect("mongodb://127.0.0.1:27017/events_db");

// mongoose.connection gives access to the connection object
const db = mongoose.connection;

// If there is an error connecting to the database
db.on("error", function (err) {
  console.log("Database connection error:", err);
});

// If connection succeeds
db.on("open", function () {
  console.log("Database connected successfully");
});


// ==============================
// DEFINING THE EVENT MODEL
// ==============================

// A Schema describes what an event looks like inside the database. converting json -> schema

const EventSchema = new mongoose.Schema({

  // Required title field
  title: { type: String, required: true },

  // Optional description
  description: { type: String, default: "" },

  // Required date field
  date: { type: String, required: true },

  // Optional time
  time: { type: String, default: "" },

  // Optional location
  location: { type: String, default: "" },

  // Optional organization
  organization: { type: String, default: "" },

  // Optional cost
  cost: { type: String, default: "" },

  // Tags stored as an array of strings
  tags: { type: [String], default: [] },

  // total number of seats available
  availableSeatings: { type: Number, required: true, min: 0 },

  // how many seats are already taken
  registeredSeatings: { type: Number, default: 0, min: 0 }

});

// Virtual field (not stored in DB, calculated automatically)
// Checks if event is full
EventSchema.virtual("isFull").get(function () {
  return this.registeredSeatings >= this.availableSeatings;
});

// This ensures virtual fields appear in JSON responses
EventSchema.set("toJSON", { virtuals: true });

// Create the model from the schema
// "Event" becomes the collection name "events" in MongoDB
const Event = mongoose.model("Event", EventSchema);


// ==============================
// SEED FUNCTION (TEST DATA)
// =================================

// In MongoDB, if the collection is empty, insert sample data.

async function seedIfEmpty() {

  // count how many documents exist
  const count = await Event.countDocuments();

  // If no events exist, insert test data
  if (count === 0) {

    console.log("Adding test events to database...");

    await Event.insertMany([
      {
        title: "Test Event A",
        description: "Seeded example event",
        date: "2026-03-10",
        time: "10:00",
        location: "Campus",
        organization: "CPS630",
        cost: "Free",
        tags: ["test"],
        availableSeatings: 10,
        registeredSeatings: 2
      }
    ]);

  } else {
    console.log("Events already exist. No seed added.");
  }
}

// Call the seed function once when server starts
seedIfEmpty();


// ==============================
// PAGE ROUTES (UNCHANGED)
// ==============================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "home.html"));
});

app.get("/addEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "addEvent.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "login.html"));
});


// ==============================
// LOGIN LOGIC (UNCHANGED)
// ==============================

const HARDCODED_USER = {
  email: "student@torontomu.ca",
  password: "password123"
};

app.post("/", (req, res) => {

  // Extract email and password from form
  const { email, password } = req.body;

  if (email === HARDCODED_USER.email &&
      password === HARDCODED_USER.password) {

    return res.redirect("/");
  }

  return res.redirect("/login");
});

app.post("/api/login", (req, res) => {

  const { email, password } = req.body;

  if (email === HARDCODED_USER.email &&
      password === HARDCODED_USER.password) {

    return res.status(200).json({ message: "Login successful" });
  }

  res.status(401).json({ error: "Invalid email or password" });
});


// ==============================
// REST API ROUTES (CRUD)
// ==============================

// Helper: get today's date in local time as "YYYY-MM-DD"
function getTodayLocalYYYYMMDD() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


// READ ALL EVENTS
// By default: return only today's and future events (so past events won't show on home page).
// If we want ALL events (including past), call: /api/events?all=true
app.get("/api/events", async (req, res) => {

  try {
    const wantAll = String(req.query.all || "").toLowerCase() === "true";

    const query = wantAll
      ? {}
      : { date: { $gte: getTodayLocalYYYYMMDD() } };

    const events = await Event.find(query).sort({ date: 1, time: 1 });
    res.status(200).json(events);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// READ ONE EVENT BY ID
app.get("/api/events/:id", async (req, res) => {

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// CREATE EVENT
app.post("/api/events", async (req, res) => {

  try {

    const {
      title,
      description,
      date,
      time,
      location,
      organization,
      cost,
      tags,
      availableSeatings
    } = req.body;

    if (!title || !date || availableSeatings === undefined) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const newEvent = await Event.create({
      title,
      description: description || "",
      date,
      time: time || "",
      location: location || "",
      organization: organization || "",
      cost: cost || "",
      tags: Array.isArray(tags) ? tags : [],
      availableSeatings: Number(availableSeatings),
      registeredSeatings: 0
    });

    res.status(201).json(newEvent);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// UPDATE EVENT
app.put("/api/events/:id", async (req, res) => {

  try {

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(updated);

  } catch (err) {
    res.status(400).json({ error: "Invalid update request" });
  }
});


// REGISTER FOR EVENT (PATCH)
app.patch("/api/events/:id/register", async (req, res) => {

  try {
    const id = req.params.id;

    // Atomically increment only if NOT full
    const updated = await Event.findOneAndUpdate(
      { _id: id, $expr: { $lt: ["$registeredSeatings", "$availableSeatings"] } },
      { $inc: { registeredSeatings: 1 } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json(updated);
    }

    // If update failed, figure out why (not found vs full)
    const exists = await Event.findById(id);
    if (!exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(409).json({ error: "Event is full" });

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// UNREGISTER FROM EVENT (PATCH)
app.patch("/api/events/:id/unregister", async (req, res) => {

  try {
    const id = req.params.id;

    // Atomically decrement only if registeredSeatings > 0
    const updated = await Event.findOneAndUpdate(
      { _id: id, registeredSeatings: { $gt: 0 } },
      { $inc: { registeredSeatings: -1 } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json(updated);
    }

    // If update failed, figure out why (not found vs already 0)
    const exists = await Event.findById(id);
    if (!exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(409).json({ error: "No registrations to remove" });

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// DELETE EVENT
app.delete("/api/events/:id", async (req, res) => {

  try {

    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(deleted);

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// START SERVER
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});