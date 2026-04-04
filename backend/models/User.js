const mongoose = require("mongoose");

// ==============================
// USER MODEL
// ==============================
// This describes what a user looks like in MongoDB.

const UserSchema = new mongoose.Schema({
  // person's name shown in the app
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  major: {
  type: String,
  required: function () {
    return this.role === "student";
  },
  trim: true
},

  // email used to log in
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  // password will be stored as a HASHED password
  // not plain text
  password: {
    type: String,
    required: true
  },

  // role controls permissions later
  // for now, normal signup users will be students
  role: {
    type: String,
    enum: ["student", "staff"],
    default: "student"
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;