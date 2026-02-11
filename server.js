const express = require("express");     // web server library
const path = require("path");           // helps build safe file paths
const fs = require("fs");               // lets us read/write files

const app = express();
const PORT = 8080;

// This lets Express read JSON bodies from POST requests
app.use(express.json());

// ADDED: This lets Express read HTML form bodies (method="POST" action="/")
app.use(express.urlencoded({ extended: true }));

// This lets Express serve files inside /public (html, css, js, images)
app.use(express.static(path.join(__dirname, "public")));

// Path to our JSON "database"
const DATA_FILE = path.join(__dirname, "data", "events.json");

// Read all events from events.json
function readEvents() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Save all events back to events.json (make sure folder exists)
function saveEvents(events) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true }); // <-- important safety
  fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2));
}


//-----
// PAGE ROUTES (HTML PAGES)
// -------------------------

// defualt route goes to login first
app.get("/", (req, res) => {
  return res.redirect("/login"); 
});

// Add Event page
app.get("/addEvent", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addEvent.html"));
});

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

//moved home page route. here to login can redirect to it
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// ------------------
// LOGIN (HARDCODED username and password)
// ------------------

const HARDCODED_USER = {
  email: "student@torontomu.ca",
  password: "password123"
};

// ADDED: POST / (because your HTML form posts to "/")
app.post("/", (req, res) => {
  const { email, password } = req.body;

  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    return res.redirect("/"); // goes to GET / -> home.html
  }

  return res.redirect("/login"); // back to login page
});

// POST /api/login = check email + password
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    return res.status(200).json({ message: "Login successful" });
  }

  res.status(401).json({ error: "Invalid email or password" });
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
  const tagSet = new Set();

  events.forEach(event => {
    if (Array.isArray(event.tags)) {
      event.tags.forEach(tag => tagSet.add(tag));
    }
  });

  res.status(200).json(Array.from(tagSet).sort());
});

// POST /api/events = add a new event
app.post("/api/events", (req, res) => {
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

  if (!title || !date) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["title", "date"]
    });
  }

  const events = readEvents();

  const newEvent = {
    id: "e" + Date.now(),
    title: title,
    description: description || "",
    date: date,
    time: time || "",
    location: location || "",
    organization: organization || "",
    capacity: capacity || "",
    cost: cost || "",
    tags: Array.isArray(tags) ? tags : []
  };

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
