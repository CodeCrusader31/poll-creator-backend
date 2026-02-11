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
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://poll-creator-fronted.vercel.app"
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.options("*", cors()); 



const allowedOrigins = [
  "http://localhost:5173",
  "https://poll-creator-fronted.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
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
