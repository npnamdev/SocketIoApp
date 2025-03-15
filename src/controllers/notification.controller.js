const Notification = require("../models/Notification");

// Tạo thông báo mới
const createNotification = async (data) => {
    try {
        const newNotification = new Notification(data);
        await newNotification.save();
        return newNotification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};

// Lấy danh sách thông báo
const getNotifications = async () => {
    try {
        return await Notification.find().sort({ createdAt: -1 });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (notificationId) => {
    try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        return notificationId;
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
};

module.exports = { createNotification, getNotifications, markAsRead };