// server.js
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");
const pollRoutes = require("./routes/pollRoutes");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app); // needed for Socket.IO

// 🔌 Connect to MongoDB
connectDB();

// 🌐 Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// 🛣️ Routes
app.use("/api/polls", pollRoutes);

// 🏠 Health check
app.get("/", (req, res) => {
  res.send("Poll Creator API running 🚀");
});

// ⚡ Socket.IO setup
initSocket(server);

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
