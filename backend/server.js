// ==============================
// IMPORTING LIBRARIES
// ==============================


const express = require("express");

// Path helps safely build file paths (so they work on Windows/Mac/Linux)
const path = require("path");

// mongoose is a library that helps node.js talk to MongoDB
const mongoose = require("mongoose");

// Get the required data models
const Event = require('./models/Event.js');



// dotenv lets the app read variables from a .env file
// Example: database URL, port, etc.
//require("dotenv").config();


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


// ========================================================
// OLD VERSION VS NEW VERSION of SERVER.JS
// ========================================================

// OLD VERSION:
// - Used fs
// - Used events.json file
// - Used readEvents() and saveEvents()
// - Stored data manually in a file

// NEW VERSION:
// - Uses MongoDB database
// - Uses Mongoose to define schema
// - Data is stored in a real database collection
// - No more fs or JSON file


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
// SEED FUNCTION (TEST DATA)
// =================================

// In MongoDB, if the collection is empty, insert sample data.

async function seedIfEmpty() {

  // count how many documents exist
  const count = await Event.countDocuments();

  // If no events exist, insert test data
  if (count === 0) {

    console.log("Adding test events to database...");

    const data = require('./data/events.json');

    data.forEach(event => {
            //since it was already created as an object, we can just add it
            const newEvent = new Event(event);
            //actually inputs into the database (save is asynch function)
            newEvent.save()
                .then(()=> console.log(event.title + "added to database"))
                .catch(err => console.error('ERROR adding event "'+ event.title + '"' + " \n" + err));
        })

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


// READ ALL EVENTS
app.get("/api/events", async (req, res) => {

  try {
    const events = await Event.find(); // get all events from DB
    res.status(200).json(events);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL EVENT TAGS
app.get("/api/tags", async (req, res) => {

  try {
    const events = await Event.find({}, 'tags'); // get all the tags from all the events in DB

    const tagSet = new Set();

    events.forEach(event => {
      if (Array.isArray(event.tags)) {
        event.tags.forEach(tag => tagSet.add(tag));
      }
    });

    res.status(200).json(Array.from(tagSet).sort());

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
      building,
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
      building: building || "",
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

// UPDATE EVENT - UNREGISTER FOR AN EVENT
app.put("/api/events/unregister/:id", async (req, res) => {

  try {

    const updated = await Event.findOneAndUpdate(
      {_id:req.params.id, 
        $expr: { $gt: ["$registeredSeatings", 0] }
      },
      {$inc: { registeredSeatings: -1 }},
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ error: "Event not found or has no registrations" });
    }

    res.status(200).json(updated);

  } catch (err) {
    res.status(400).json({ error: "Unregistration Failed" });
  }
});

// UPDATE EVENT - REGISTER FOR AN EVENT
app.put("/api/events/register/:id", async (req, res) => {

  try {

    const updated = await Event.findOneAndUpdate(
      {_id:req.params.id, 
        $expr: { $lt: ["$registeredSeatings", "$availableSeatings"] }
      },
      {$inc: { registeredSeatings: 1 }},
      { new: true } // return updated document
    );

    if (!updated) {
      return res.status(404).json({ error: "Event not found or is full" });
    }

    res.status(200).json(updated);

  } catch (err) {
    res.status(400).json({ error: "Registration Failed" });
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