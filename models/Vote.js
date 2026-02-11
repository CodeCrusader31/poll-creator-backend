// models/Vote.js
const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  pollId: { type: String, required: true },

  voterId: { type: String, required: true }, // IP + user-agent fingerprint

  name: { type: String, default: null }, // Only if poll requires identity

  optionIds: [{ type: String, required: true }],

  votedAt: { type: Date, default: Date.now }

});

// Prevent duplicate voting per poll per voter
voteSchema.index({ pollId: 1, voterId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
