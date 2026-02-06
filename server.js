// import Express
const express = require("express");

// import Node utilities
const path = require("path");
const fs = require("fs");

// create the xpress app
const app = express();
const PORT = 8080;


// MIDDLEWARE

// this lets the server read JSON from POST requests
app.use(express.json());

// Ttis lets the server serve HTML, CSS, images from /public
app.use(express.static(path.join(__dirname, "public")));


// "DATABASE" (JSON FILE)

const DATA_FILE = path.join(__dirname, "data", "events.json");

// reead events from file
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

// Add Event page
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


// GET all unique tags from all events
// This is used so the frontend can generate filters/checkboxes dynamically
app.get("/api/tags", (req, res) => {
  const events = readEvents();
  const tagSet = new Set();

  events.forEach(event => {
    if (Array.isArray(event.tags)) {
      event.tags.forEach(tag => tagSet.add(String(tag)));
    }
  });

  res.status(200).json(Array.from(tagSet).sort());
});


// POST: add a new event (now stores tags + extra fields)
app.post("/api/events", (req, res) => {
  const {
    title,
    date,
    location,
    description,
    time,
    creator,
    imageUrl,
    seats,
    price,
    tags
  } = req.body;

  // Validate input
  if (!title || !date) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["title", "date"]
    });
  }

  // Make tags alwayss an arraye
  let cleanTags = [];

  if (Array.isArray(tags)) {
    cleanTags = tags;
  } else if (typeof tags === "string") {
    cleanTags = tags.split(",");
  }

  cleanTags = cleanTags
    .map(t => String(t).trim())
    .filter(t => t.length > 0);

  // remove duplicates
  cleanTags = [...new Set(cleanTags)];

  const events = readEvents();

  const newEvent = {
    id: "e" + Date.now(),
    title: String(title),
    date: String(date),

    //default values
    price: Number.isFinite(Number(price)) ? Number(price) : 0,
    location: location ? String(location) : "",
    description: description ? String(description) : "",
    time: time ? String(time) : "",
    creator: creator ? String(creator) : "",
    seats: Number.isFinite(Number(seats)) ? Number(seats) : 0,

    //image support = store a URL string 
    imageUrl: imageUrl ? String(imageUrl) : "",

    // store tags in the JSON database
    tags: cleanTags
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
