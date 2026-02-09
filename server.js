
const express = require("express");     // web server library
const path = require("path");           // helps build safe file paths
const fs = require("fs");               // lets us read/write files

const app = express();
const PORT = 8080;

// This lets Express read JSON bodies from POST requests
app.use(express.json());

// This lets Express serve files inside /public (html, css, js, images)
app.use(express.static(path.join(__dirname, "public")));

// Path to our JSON "database"
const DATA_FILE = path.join(__dirname, "data", "events.json");

// Read all events from events.json
function readEvents() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8"); // read file text
    return JSON.parse(data);                         // turn into JS array
  } catch (err) {
    return []; // if file missing or broken, return empty list
  }
}

// Save all events back to events.json
function saveEvents(events) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}

//-----
// PAGE ROUTES (HTML PAGES)
// -------------------------

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

// ------------------
// REST API ROUTES
// --------------

// GET /api/events = return all events
app.get("/api/events", (req, res) => {
  const events = readEvents();
  res.status(200).json(events);
});

// GET /api/tags = return all unique tags found in events.json
app.get("/api/tags", (req, res) => {
  const events = readEvents();
  const tagSet = new Set(); // Set automatically removes duplicates

  // Loop through each event and collect its tags
  events.forEach(event => {
    if (Array.isArray(event.tags)) {
      event.tags.forEach(tag => tagSet.add(tag));
    }
  });

  // Convert Set -> Array and sort alphabetically
  res.status(200).json(Array.from(tagSet).sort());
});

// POST /api/events = add a new event (matches your JSON fields)
app.post("/api/events", (req, res) => {
  // Pull fields from the request body
  const {
    title,
    description,
    date,
    time,
    location,
    organization,
    capacity,
    cost,
    tags
  } = req.body;

  // Basic validation: title and date are required
  if (!title || !date) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["title", "date"]
    });
  }

  const events = readEvents();

  // Create a new event object that matches your JSON format
  const newEvent = {
    id: "e" + Date.now(),                 // simple unique id
    title: title,
    description: description || "",
    date: date,
    time: time || "",
    location: location || "",
    organization: organization || "",
    capacity: capacity || "",
    cost: cost || "",
    tags: Array.isArray(tags) ? tags : [] // tags must be an array
  };

  // Add and save
  events.push(newEvent);
  saveEvents(events);

  res.status(201).json(newEvent);
});

// DELETE /api/events/:id = delete an event by id
app.delete("/api/events/:id", (req, res) => {
  const id = req.params.id;
  const events = readEvents();

  const index = events.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  const deleted = events.splice(index, 1)[0];
  saveEvents(events);

  res.status(200).json(deleted);
});

// If none of the routes match, return 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
