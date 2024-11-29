const express = require("express");
const bcrypt = require("bcrypt");
const Credential = require("../models/credentials");
const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register", { msg: "JUST A LITTLE BIT ABOUT YOU" });
});

router.post("/register", async (req, res) => {
  try {
    const { name, date, email, password, passwordConf } = req.body;

    if (!name || !date || !email || !password || !passwordConf) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== passwordConf) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Credential({
      name,
      date,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).render("login");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await Credential.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not found, try registering !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const date = new Date(user.date);

    // Adjust date to UTC by removing the time zone effect
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

    // Format the date as MM/DD/YYYY
    const formattedDate =
      (date.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      date.getDate().toString().padStart(2, "0") +
      "/" +
      date.getFullYear();

    // req.session.userId = user._id;
    res.render("profile", {
      name: user.name,
      email: user.email,
      bio: "",
      date: formattedDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
});

router.get("/edit", (req, res) => {
  res.render("register", { msg: "EDIT YOUR PROFILE" });
});

module.exports = router;
