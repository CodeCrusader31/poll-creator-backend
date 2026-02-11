# 🗳️ Poll Creator – Backend API

REST API + WebSocket server powering the Poll Creator application.

🌐 **Live API:** https://poll-creator-backend.onrender.com  

---

## 🚀 Features

- Create polls
- Submit votes
- Prevent duplicate voting
- Poll expiry handling
- Manual poll closing
- Real-time vote broadcasting
- Anonymous & identified voting modes

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.IO
- CORS Middleware

---

## ⚙️ Environment Variables

Create `.env` file:

PORT=5000
MONGODB_URI=your_mongodb_connection
CORS_ORIGIN=https://poll-creator-fronted.vercel.app


---

## 🧩 Installation

```bash
git clone <backend-repo-url>
cd backend
npm install
node server.js


