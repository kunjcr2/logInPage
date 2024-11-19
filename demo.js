const mongoose = require("mongoose");

// Assume you have a Mongoose model called `YourModel`
const YourModel = mongoose.model(
  "YourCollectionName",
  new mongoose.Schema({
    field: String, // Replace `field` with your actual field name
  })
);

async function checkVariable(x) {
  try {
    // Check if `x` exists in the field
    const result = await YourModel.findOne({ field: x });
    if (result) {
      console.log("Found:", result);
    } else {
      console.log("Not found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the function with your variable
checkVariable("value_to_check");
