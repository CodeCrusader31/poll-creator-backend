const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://poll-creator-fronted.vercel.app"
      ],
      credentials: true,
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("join-poll", (pollId) => {
      socket.join(`poll-${pollId}`);
    });

    socket.on("leave-poll", (pollId) => {
      socket.leave(`poll-${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket not initialized");
  return io;
}

module.exports = initSocket;
module.exports.getIO = getIO;
