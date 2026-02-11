const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const calculateResults = require("../utils/resultCalculator");
const { getIO } = require("../socket");
const { nanoid } = require("nanoid");

// CREATE POLL
exports.createPoll = async (req, res) => {
  try {
    const { question, options, allowMultiple, expiresAt, votingMode } =
      req.body;

    const pollId = `poll_${nanoid(6)}`;
    const { voterId } = req.voter;

    const formattedOptions = options.map((opt, index) => ({
      id: `opt_${index + 1}`,
      text: opt,
    }));

    const poll = await Poll.create({
      pollId,
      question,
      options: formattedOptions,
      allowMultiple: allowMultiple || false,
      expiresAt: expiresAt || null,
      votingMode: votingMode || "anonymous",
      creatorId: voterId,
    });

    res.status(201).json({
      ...poll.toObject(),
      shareUrl: `/poll/${poll.pollId}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET POLL (with results)
exports.getPoll = async (req, res) => {
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Expiry check
    if (
      poll.expiresAt &&
      new Date() > poll.expiresAt &&
      poll.status === "active"
    ) {
      poll.status = "expired";
      await poll.save();
    }

//     console.log("Request voterId:", req.voter.voterId);
// console.log("Poll creatorId:", poll.creatorId);


    //res.json(calculateResults(poll));
    res.json({
  ...calculateResults(poll),
  isCreator: req.voter?.voterId === poll.creatorId
});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SUBMIT VOTE
exports.submitVote = async (req, res) => {
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (poll.status !== "active") {
      return res.status(400).json({ error: "Poll is closed or expired" });
    }

    const { voterId, name } = req.voter;
    const optionIds = poll.allowMultiple
      ? req.body.optionIds
      : [req.body.optionId];

    // Duplicate prevention
    const existingVote = await Vote.findOne({ pollId: poll.pollId, voterId });
    if (existingVote) return res.status(403).json({ error: "Already voted" });

    // Update votes
    optionIds.forEach((id) => {
      const option = poll.options.find((opt) => opt.id === id);
      if (option) option.votes += 1;
    });

    poll.totalVotes += 1;
    await poll.save();

    // Save vote record
    await Vote.create({
      pollId: poll.pollId,
      voterId,
      name,
      optionIds,
    });

    const updatedPoll = calculateResults(poll);

    // Real-time update
    getIO().to(`poll-${poll.pollId}`).emit("vote-updated", updatedPoll);

    res.json(updatedPoll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CLOSE POLL
exports.closePoll = async (req, res) => {
  try {
    const poll = await Poll.findOne({ pollId: req.params.id });
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    if (req.voter.voterId !== poll.creatorId) {
      return res.status(403).json({ error: "Only creator can close poll" });
    }

    poll.status = "closed";
    await poll.save();

    getIO().to(`poll-${poll.pollId}`).emit("poll-closed");

    res.json({ message: "Poll closed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


