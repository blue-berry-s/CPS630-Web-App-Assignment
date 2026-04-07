// ==============================
// IMPORT LIBRARIES
// ==============================

// express lets us build the server and create routes
const express = require("express");

 // import HTTP module for socket.io
const http = require("http");

// import socket.io
const { Server } = require("socket.io"); 


// path helps us safely find files like html/css/js
const path = require("path");

// mongoose lets node talk to MongoDB
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs"); // used to hash passwords
const jwt = require("jsonwebtoken"); // used to create login tokens
const cors = require("cors"); // allows frontend requests
const Event = require("./models/Event.js");
const User = require("./models/User.js"); // user model

// ==============================
// BASIC SERVER SETUP
// ==============================

const app = express();
const PORT = 8080; // the port our server will run on

// secret key used to create login tokens
// okay to keep simple for class project
const JWT_SECRET = "my_secret_key";

// allows the server to read JSON data sent from frontend
app.use(express.json());

// allows the server to read form data
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// serve the frontend files (html, css, js)
app.use(express.static(path.join(__dirname, "../frontend/public")));


const seedEvents = require("./data/events.json");

// ==============================
// CONNECT TO MONGODB
// ==============================

// connect to our local MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/events_db");

const db = mongoose.connection;

// if there is an error connecting
db.on("error", function (err) {
  console.log("Database connection error:", err);
});


// this checks if the MongoDB "events" collection is empty.
// If no events exist, it inserts sample test data from events.json.
async function seedIfEmpty() {
  const count = await Event.countDocuments();

  if (count === 0) {
    console.log("Seeding database with sample events...");
    await Event.insertMany(seedEvents);
  } else {
    console.log("Database already has events. No seed added.");
  }
}

db.once("open", async function () {
  console.log("Database connected successfully");

  try {
    await seedIfEmpty();
  } catch (err) {
    console.log("Error while seeding database:", err);
  }
});


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

  //registered user
  obj.isRegistered = obj.registeredUsers.some(
    u => String(u) === String(userId)
  );


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
// AUTH HELPER MIDDLEWARE
// ==============================

// This function checks if the user is logged in.
// The frontend must send a token like:
// Authorization: Bearer <token>
function requireAuth(req, res, next) {

  // get authorization header from request
  const authHeader = req.headers.authorization;

  // if header is missing OR not in correct format → reject
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // extract token from "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  try {
    // verify token using our secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // store user info inside request
    // now we can access:
    // req.user.userId
    // req.user.role
    req.user = decoded;

    // continue to next function (route)
    next();

  } catch (err) {
    // token invalid or expired
    return res.status(401).json({ error: "Invalid token" });
  }
}


// This function checks if user is STAFF
// used for routes like:
// - create event
// - delete event
function requireStaff(req, res, next) {

  // if no user OR user is not staff ->reject
  if (!req.user || req.user.role !== "staff") {
    return res.status(403).json({ error: "Staff only action" });
  }

  // user is staff -> continue
  next();
}

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
// AUTH ROUTES
// ==============================

// REGISTER NEW USER
// This lets a new user create an account in MongoDB.
app.post("/api/auth/register", async (req, res) => {
  try {
    // get data sent from frontend
    const { name, major, email, password } = req.body;

    // basic check so empty fields are not allowed
    if (!name ||!major || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required"
      });
    }

    // check if a user with this email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    // turn plain password into a secure hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the new user
    const newUser = await User.create({
      name,
      major,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student" // default role for normal signup
    });

    // send safe user info back to frontend
    // do NOT send password back
    res.status(201).json({
      message: "User created",
      user: {
        _id: newUser._id,
        name: newUser.name,
        major: newUser.major,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});



// ==============================
// LOGIN USER
// ==============================

// This checks if email/password are correct and returns a token.
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic check for missing fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    // find user by email
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    // if email does not exist
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // compare plain password with hashed password in database
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // create token so frontend can prove user is logged in later
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // send token + user info back to frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        major: user.major,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
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

// only logged-in STAFF can create events
app.post("/api/events", requireAuth, requireStaff, async (req, res) => {

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
      capacity
    } = req.body;

    let finalTags = [];

    if (Array.isArray(tags)) {
      finalTags = tags;
    } else if (tags) {
      finalTags = [tags];
    }

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
      building,
      location: location || "",
      organization: organization || "",
      cost: cost || "",
      tags: finalTags,
      availableSeatings: seats,
      registeredSeatings: 0,
      // start with empty registered users list
      registeredUsers: []
    });

    res.status(201).json(toFrontendEvent(newEvent));

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ==============================
// START SERVER WITH SOCKET.IO
// ==============================

  // creates HTTP server from Express app
  const server = http.createServer(app);

  // creates Socket.io server
  const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PATCH"]
    }
  });
  
  // listen for client connections
  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
  
    socket.on("disconnect", () => {
      console.log("A user disconnected: " + socket.id);
    });
  });
  
  
// ==============================
// REGISTER FOR EVENT
// ==============================

// This allows a logged-in user to register for an event
app.patch("/api/events/register/:id", requireAuth, async (req, res) => {
  try {

    // find event by id
    const event = await Event.findById(req.params.id);

    // if event does not exist
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // check if user already registered
    // prevents duplicate registration
    const alreadyRegistered = event.registeredUsers.some(
      userId => String(userId) === req.user.userId
    );

    if (alreadyRegistered) {
      return res.status(409).json({
        error: "User already registered"
      });
    }

    // check if event is full
    if (event.registeredSeatings >= event.availableSeatings) {
      return res.status(409).json({ error: "Event is full" });
    }

    // add user ID to registeredUsers list
    event.registeredUsers.push(req.user.userId);

    // increase seat count
    event.registeredSeatings += 1;

    // save changes to database
    await event.save();

    //io
    io.to(event._id.toString()).emit("eventUpdated", toFrontendEvent(event));

    // return updated event
    return res.status(200).json(toFrontendEvent(event));

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// ==============================
// UNREGISTER FROM EVENT
// ==============================

// allows logged-in user to remove themselves from event
app.patch("/api/events/unregister/:id", requireAuth, async (req, res) => {
  try {

    // find event
    const event = await Event.findById(req.params.id);

    // event not found
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // check if user is actually registered
    const wasRegistered = event.registeredUsers.some(
      userId => String(userId) === req.user.userId
    );

    if (!wasRegistered) {
      return res.status(409).json({
        error: "User not registered"
      });
    }

    // remove user from registeredUsers list
    event.registeredUsers = event.registeredUsers.filter(
      userId => String(userId) !== req.user.userId
    );

    // decrease seat count safely
    event.registeredSeatings = Math.max(0, event.registeredSeatings - 1);

    // save changes
    await event.save();

    //io
    io.to(event._id.toString()).emit("eventUpdated", toFrontendEvent(event));


    // return updated event
    return res.status(200).json(toFrontendEvent(event));

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

// ==============================e
// DELETE EVENT
// ==============================

// only STAFF can delete events
app.delete("/api/events/:id", requireAuth, requireStaff, async (req, res) => {

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