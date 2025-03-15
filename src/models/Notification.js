const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    }
);

module.exports = mongoose.model("Notification", NotificationSchema);