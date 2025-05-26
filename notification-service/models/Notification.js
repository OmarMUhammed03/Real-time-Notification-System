const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  category: {
    type: String,
    enum: ["inbox", "spam", "starred"],
    required: true,
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", NotificationSchema);
