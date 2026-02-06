
// Import Express
const express = require("express");

// Import Node utilities
const path = require("path");
const fs = require("fs");

// Create Express app
const app = express();
const PORT = 8080;


// MIDDLEWARE


// This lets the server read JSON from POST requests
app.use(express.json());

// Thi lets the server serve HTML, CSS, images from /public
app.use(express.static(path.join(__dirname, "public")));


// "DATABASE" (JSON FILE)


const DATA_FILE = path.join(__dirname, "data", "events.json");

// Read events from file
function readEvents() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return []; // if file missing or broken
  }
}

// Save events to file
function saveEvents(events) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}


// PAGE ROUTES 

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Product page
app.get("/addEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addEvent.html"));
});

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


// REST API

// GET: return list of events
app.get("/api/events", (req, res) => {
  const events = readEvents();
  res.status(200).json(events); // 200 OK
});

// POST: add a new event
app.post("/api/events", (req, res) => {
  const { title, date, location } = req.body;

  // Validate input
  if (!title || !date) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["title", "date"]
    });
  }

  const events = readEvents();

  const newEvent = {
    id: "e" + Date.now(),
    title,
    date,
    location: location || ""
  };

  events.push(newEvent);
  saveEvents(events);

  res.status(201).json(newEvent); // 201 Created
});

// DELETE: remove event by id
app.delete("/api/events/:id", (req, res) => {
  const id = req.params.id;
  const events = readEvents();

  const index = events.findIndex(e => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  const deletedEvent = events.splice(index, 1)[0];
  saveEvents(events);

  res.status(200).json(deletedEvent); // 200 OK
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// START SERVER
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
