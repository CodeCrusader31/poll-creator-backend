// models/Poll.js
const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },   // "opt_1"
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  pollId: { type: String, required: true, unique: true },

  question: { type: String, required: true },

  options: [optionSchema],

  allowMultiple: { type: Boolean, default: false },

  votingMode: {
    type: String,
    enum: ["anonymous", "identified", "both"],
    default: "anonymous"
  },

  totalVotes: { type: Number, default: 0 },
  creatorId: { type: String, required: true },

  status: {
    type: String,
    enum: ["active", "closed", "expired"],
    default: "active"
  },

  expiresAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model("Poll", pollSchema);
