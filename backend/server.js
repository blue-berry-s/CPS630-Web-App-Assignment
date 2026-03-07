// ==============================
// IMPORT LIBRARIES
// ==============================

// express lets us build the server and create routes
const express = require("express");

// path helps us safely find files like html/css/js
const path = require("path");

// mongoose lets node talk to MongoDB
const mongoose = require("mongoose");


// ==============================
// BASIC SERVER SETUP
// ==============================

const app = express();
const PORT = 8080; // the port our server will run on

// allows the server to read JSON data sent from frontend
app.use(express.json());

// allows the server to read form data
app.use(express.urlencoded({ extended: true }));

// serve the frontend files (html, css, js)
app.use(express.static(path.join(__dirname, "../frontend/public")));


// ==============================
// CONNECT TO MONGODB
// ==============================

// connect to our local MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/events_db");

// mongoose connection object
const db = mongoose.connection;

// if there is an error connecting
db.on("error", function (err) {
  console.log("Database connection error:", err);
});

// if connection works
db.on("open", function () {
  console.log("Database connected successfully");
});


// ==============================
// EVENT MODEL (SCHEMA)
// ==============================

// this defines the structure of an event inside MongoDB
const EventSchema = new mongoose.Schema({

  // title is required
  title: { type: String, required: true },

  // description is optional
  description: { type: String, default: "" },

  // date is required
  date: { type: String, required: true },

  // optional event time
  time: { type: String, default: "" },

  // optional location
  location: { type: String, default: "" },

  // optional organization hosting event
  organization: { type: String, default: "" },

  // optional price
  cost: { type: String, default: "" },

  // tags for filtering events
  tags: { type: [String], default: [] },

  // total seats available
  availableSeatings: { type: Number, required: true, min: 0 },

  // seats already taken
  registeredSeatings: { type: Number, default: 0, min: 0 }

});

// virtual property (not stored in database)
// checks if event is already full
EventSchema.virtual("isFull").get(function () {
  return this.registeredSeatings >= this.availableSeatings;
});

// make sure virtual fields appear when sending JSON
EventSchema.set("toJSON", { virtuals: true });

// create model so we can interact with events collection
const Event = mongoose.model("Event", EventSchema);


// ==============================
// HELPER FUNCTIONS
// ==============================

// this converts a MongoDB event into the format
// the frontend expects
function toFrontendEvent(doc) {

  const obj = doc.toJSON();

  // frontend expects "id" not "_id"
  obj.id = String(obj._id);

  // frontend expects capacity as text like "40 seats"
  obj.capacity = `${obj.availableSeatings} seats`;

  return obj;
}

// convert frontend capacity string into a number
function parseCapacityToSeats(capacity) {

  if (!capacity) return NaN;

  // find numbers inside the string
  const match = String(capacity).match(/\d+/);

  if (!match) return NaN;

  return Number(match[0]);
}


// ==============================
// ADD TEST DATA IF DATABASE EMPTY
// ==============================

// this just inserts a test event if there are none
async function seedIfEmpty() {

  const count = await Event.countDocuments();

  if (count === 0) {

    console.log("Adding test events...");

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

  }
}

seedIfEmpty();


// ==============================
// PAGE ROUTES
// ==============================

// load home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "home.html"));
});

// load add event page
app.get("/addEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "addEvent.html"));
});

// load login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public", "login.html"));
});


// ==============================
// LOGIN 
// ==============================

// simple login info (just for demo purposes)
const HARDCODED_USER = {
  email: "student@torontomu.ca",
  password: "password123"
};

app.post("/", (req, res) => {

  const { email, password } = req.body;

  if (email === HARDCODED_USER.email &&
    password === HARDCODED_USER.password) {

    return res.redirect("/");
  }

  return res.redirect("/login");
});


// login api for frontend
app.post("/api/login", (req, res) => {

  const { email, password } = req.body;

  if (email === HARDCODED_USER.email &&
    password === HARDCODED_USER.password) {

    return res.status(200).json({ message: "Login successful" });
  }

  res.status(401).json({ error: "Invalid email or password" });
});


// ==============================
// HELPER FUNCTION FOR DATE
// ==============================

// get today's date in YYYY-MM-DD format
function getTodayLocalYYYYMMDD() {

  const now = new Date();

  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}


// ==============================
// GET EVENTS
// ==============================

// get events from database
// by default we only show upcoming events
app.get("/api/events", async (req, res) => {

  try {

    const wantAll = String(req.query.all || "").toLowerCase() === "true";

    const query = wantAll
      ? {}
      : { date: { $gte: getTodayLocalYYYYMMDD() } };

    const events = await Event.find(query).sort({ date: 1, time: 1 });

    res.status(200).json(events.map(toFrontendEvent));

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ==============================
// GET ONE EVENT
// ==============================

app.get("/api/events/:id", async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(toFrontendEvent(event));

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// ==============================
// GET TAGS
// ==============================

// return list of all unique tags in database
app.get("/api/tags", async (req, res) => {

  try {

    const events = await Event.find({}, { tags: 1, _id: 0 });

    const tags = [...new Set(events.flatMap(e => e.tags || []))];

    res.status(200).json(tags);

  } catch (err) {
    res.status(500).json({ error: "Could not load tags" });
  }
});


// ==============================
// CREATE EVENT
// ==============================

// create new event from form
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
      capacity
    } = req.body;

    const seats = parseCapacityToSeats(capacity);

    if (!title || !date || Number.isNaN(seats) || seats < 0) {
      return res.status(400).json({
        error: "Invalid event data"
      });
    }

    if (cost && Number(cost) < 0) {
      return res.status(400).json({ error: "Cost cannot be negative" });
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
      availableSeatings: seats,
      registeredSeatings: 0
    });

    res.status(201).json(toFrontendEvent(newEvent));

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ==============================
// REGISTER FOR EVENT
// ==============================

// increment registeredSeatings by 1 (but only if event not full)
app.patch("/api/events/register/:id", async (req, res) => {

  try {

    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, $expr: { $lt: ["$registeredSeatings", "$availableSeatings"] } },
      { $inc: { registeredSeatings: 1 } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json(toFrontendEvent(updated));
    }

    const exists = await Event.findById(req.params.id);

    if (!exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(409).json({ error: "Event is full" });

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// ==============================
// UNREGISTER FROM EVENT
// ==============================

// decrement registeredSeatings by 1 (but only if registeredSeatings > 0)
app.patch("/api/events/unregister/:id", async (req, res) => {

  try {

    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, registeredSeatings: { $gt: 0 } },
      { $inc: { registeredSeatings: -1 } },
      { new: true }
    );

    if (updated) {
      return res.status(200).json(toFrontendEvent(updated));
    }

    const exists = await Event.findById(req.params.id);

    if (!exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(409).json({ error: "No registrations to remove" });

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// ==============================
// DELETE EVENT
// ==============================

app.delete("/api/events/:id", async (req, res) => {

  try {

    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(toFrontendEvent(deleted));

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});


// ==============================
// START SERVER
// ==============================

// start the server
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});