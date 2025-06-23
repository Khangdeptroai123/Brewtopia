const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    cafe: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe", required: true },
    title: String,
    description: String,
    date: Date,
    image: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    Countfollower: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);
const event = mongoose.model("Event", EventSchema);
module.exports = event;
