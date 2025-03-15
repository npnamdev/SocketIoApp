// const { createNotification, getNotifications, markAsRead } = require("../controllers/notification.controller");

// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("🟢 User connected:", socket.id);

//     // Gửi danh sách thông báo khi client yêu cầu
//     socket.on("getNotifications", async () => {
//       const notifications = await getNotifications();
//       socket.emit("notificationsList", notifications);
//     });

//     // Xử lý tạo thông báo mới
//     socket.on("createNotification", async (data) => {
//       const notification = await createNotification(data);
//       io.emit("newNotification", notification); // Gửi thông báo đến tất cả client
//     });

//     // Đánh dấu thông báo là đã đọc
//     socket.on("markAsRead", async (notificationId) => {
//       await markAsRead(notificationId);
//       io.emit("notificationRead", notificationId);
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 User disconnected:", socket.id);
//     });
//   });
// };


module.exports = (io, socket) => {
  socket.on("sendNotification", (data) => {
    console.log("📢 New Notification:", data);
    io.emit("receiveNotification", data); // Gửi thông báo đến tất cả client
  });
};