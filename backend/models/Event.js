const mongoose = require('mongoose');

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

  // Optional Building
  building: { type: String, default: "" },

  // Optional location
  location: { type: String, default: "" },

  // Optional organization
  organization: { type: String, default: "" },

  // Optional cost
  cost: { type: String, default: "" },

  // Tags stored as an array of strings
  tags: { type: [String], default: [] },

  // NEW addition: 
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
const Event = mongoose.model('Event', EventSchema);
module.exports = Event;