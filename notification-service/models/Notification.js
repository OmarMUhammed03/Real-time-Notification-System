const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ["inbox", "spam", "sent", "starred"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});
