const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const users = require("./data/users.json");

mongoose.connect("mongodb://127.0.0.1:27017/events_db");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("MongoDB connected");

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Check if user already exists
    const exists = await User.findOne({ email: user.email.toLowerCase() });
    if (exists) {
      console.log(`User ${user.email} already exists`);
      continue;
    }

    const newUser = new User({
      name: user.name,
      joinYear: user.joinYear,
      major: user.major,
      email: user.email.toLowerCase(),
      password: hashedPassword,
      role: user.role
    });

    await newUser.save();
    console.log(`User ${user.email} added`);
  }

  console.log("All users seeded");
  process.exit(); // stop script
});