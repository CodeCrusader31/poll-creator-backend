// utils/resultCalculator.js

const calculateResults = (poll) => {
  const totalVotes = poll.totalVotes;

  const optionsWithPercentage = poll.options.map(option => ({
    id: option.id,
    text: option.text,
    votes: option.votes,
    percentage: totalVotes > 0
      ? Number(((option.votes / totalVotes) * 100).toFixed(2))
      : 0
  }));

  return {
    ...poll.toObject(),
    options: optionsWithPercentage
  };
};

module.exports = calculateResults;
