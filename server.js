require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");

const connectDB = require("./config/db");
const pollRoutes = require("./routes/pollRoutes");
const initSocket = require("./socket");

const app = express();
const server = http.createServer(app);

// 🔌 Connect to MongoDB
connectDB();


// 🌐 CORS CONFIG (WORKS FOR LOCAL + VERCEL)
const allowedOrigins = [
  "http://localhost:5173",
  "https://poll-creator-fronted.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



app.use(express.json());
app.use("/api/polls", pollRoutes);

app.get("/", (req, res) => {
  res.send("Poll Creator API running 🚀");
});


initSocket(server);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
