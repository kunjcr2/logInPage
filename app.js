const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

// Connect to MongoDB
const dbURI = process.env.dbURL;
const PORT = process.env.PORT || 5000;

if (!dbURI) {
  console.error("Missing database URI in environment variables.");
  process.exit(1);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

mongoose
  .connect(dbURI)
  .then(() => {
    const app = express();

    // Middleware and settings
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.static("public"));

    // Use the routes
    app.use(authRoutes);

    app.get("/", (req, res) => {
      res.render("entry");
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));
