const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const credential = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
});

const credentials = mongoose.model("credentials", credential);

module.exports = credentials;
