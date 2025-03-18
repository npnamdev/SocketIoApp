require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const path = require("path");

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(cors());
app.use(express.json());

// Danh sách người dùng (đơn giản, không lưu DB)
const users = [
  { username: "alice", password: "123" },
  { username: "bob", password: "456" },
  { username: "charlie", password: "789" },
];

// Danh sách user online
let onlineUsers = [];

// Mô hình tin nhắn MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

const MessageSchema = new mongoose.Schema({
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", MessageSchema);

// API lấy tin nhắn
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(20);
  res.json(messages.reverse());
});

// API đăng nhập
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, username });
  } else {
    res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" });
  }
});

// Socket.IO xử lý chat
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on("userJoined", (username) => {
    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
      io.emit("updateUsers", onlineUsers); // Gửi danh sách online
    }
  });

  socket.on("sendMessage", async (data) => {
    const { username, text } = data;
    const message = new Message({ username, text });
    await message.save();
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
    onlineUsers = onlineUsers.filter((user) => user !== socket.username);
    io.emit("updateUsers", onlineUsers);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
