const Notification = require("../models/Notification");

exports.createNotification = async (notification) => {
  const createdNotification = await Notification.create(notification);
  return createdNotification;
};

exports.getNotifications = async (userId) => {
  const notifications = await Notification.find({ receiverId: userId });
  return notifications;
};

exports.getSentNotifications = async (userId) => {
  const notifications = await Notification.find({ senderId: userId });
  return notifications;
};

exports.updateNotification = async (notificationId, update) => {
  const updatedNotification = await Notification.findByIdAndUpdate(
    notificationId,
    update,
    { new: true }
  );
  return updatedNotification;
};

exports.deleteNotification = async (notificationId) => {
  const deletedNotification = await Notification.findByIdAndDelete(
    notificationId
  );
  return deletedNotification;
};

exports.markNotificationAsRead = async (notificationId) => {
  const updatedNotification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
  return updatedNotification;
};
