const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    location: String,
    latitude: Number,
    longitude: Number,
    image: String,
    userId: String,
    username: String,
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);