const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Điều chỉnh đường dẫn để tìm đúng thư mục public nằm ngoài src
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Xử lý Socket.IO
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("sendNotification", (data) => {
    console.log("📢 Nhận thông báo:", data);

    // Gửi tới tất cả client TRỪ người gửi
    socket.broadcast.emit("receiveNotification", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});