// socket.js
const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // Join poll room
    socket.on("join-poll", (pollId) => {
      socket.join(`poll-${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

// Function to emit updates from controller
const getIO = () => io;

module.exports = initSocket;
module.exports.getIO = getIO;
