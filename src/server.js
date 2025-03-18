const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, "..", "public")));

const users = {}; // Lưu user và socket ID
const messages = { general: [] }; // Lưu tin nhắn, key là tên người dùng

io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Khi user đăng nhập
    socket.on("login", (username) => {
        users[socket.id] = username;
        messages[username] = messages[username] || [];
        io.emit("userList", Object.values(users)); // Gửi danh sách user
    });

    // Gửi tin nhắn chung
    socket.on("sendMessage", (data) => {
        messages.general.push({ user: users[socket.id], text: data.text });
        io.emit("receiveMessage", { user: users[socket.id], text: data.text });
    });

    // Gửi tin nhắn riêng
    socket.on("privateMessage", ({ toUsername, message }) => {
        if (!messages[toUsername]) messages[toUsername] = [];
        if (!messages[users[socket.id]]) messages[users[socket.id]] = [];

        messages[toUsername].push({ from: users[socket.id], text: message });
        messages[users[socket.id]].push({ from: users[socket.id], text: message });

        const recipientSocket = Object.keys(users).find((id) => users[id] === toUsername);
        if (recipientSocket) {
            io.to(recipientSocket).emit("receivePrivateMessage", { from: users[socket.id], text: message });
        }
    });

    // Khi user ngắt kết nối
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
        delete users[socket.id];
        io.emit("userList", Object.values(users));
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
