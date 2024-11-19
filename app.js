const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const credential = require("./models/credentials");

const dbURI = process.env.dbURI;

const app = express();
const PORT = process.env.PORT || 5000;

if (!dbURI) {
  console.error("Missing database URI in environment variables.");
  process.exit(1);
}

// Connecting to database
mongoose
  .connect(dbURI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("entry");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Registering a new user with confirmation password
app.post("/register", async (req, res) => {
  try {
    const { name, age, email, password, passwordConf } = req.body;

    if (password !== passwordConf) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new credential({
      name,
      age,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).render("login");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating user" });
  }
});

// Checking if the user can log in or not
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await credential.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.render("main");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
});
