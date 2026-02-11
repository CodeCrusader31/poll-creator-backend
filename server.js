require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");
const pollRoutes = require("./routes/pollRoutes");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app);

// 🔌 Connect DB
connectDB();

// 🌐 CORS FOR API
const allowedOrigins = [
  "http://localhost:5173",
  "https://poll-creator-fronted.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.options("*", cors());


app.use(express.json());

// 🛣 Routes
app.use("/api/polls", pollRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Poll Creator API running 🚀");
});

// ⚡ Init Socket
initSocket(server);

// 🚀 Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
