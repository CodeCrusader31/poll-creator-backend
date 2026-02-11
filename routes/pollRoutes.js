// routes/pollRoutes.js
const express = require("express");
const router = express.Router();

const voterTracking = require("../middleware/voterTracking");
const {
  createPoll,
  getPoll,
  submitVote,
  closePoll
} = require("../controllers/pollController");

// Create a poll
router.post("/", voterTracking,createPoll);

// Get poll details
router.get("/:id",voterTracking, getPoll);

// Submit vote (middleware identifies voter)
router.post("/:id/vote", voterTracking, submitVote);

// Close poll manually
router.post("/:id/close",voterTracking, closePoll);

module.exports = router;
