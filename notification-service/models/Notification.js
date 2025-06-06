const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  receiverName: { type: String, required: true },
  category: {
    type: String,
    enum: ["inbox", "spam", "starred"],
    required: true,
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Notification", NotificationSchema);
