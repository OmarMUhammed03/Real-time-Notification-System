const Notification = require("../models/Notification");

exports.createNotification = async (notification) => {
  const createdNotification = await Notification.create(notification);
  return createdNotification;
};

exports.getNotification = async (notificationId) => {
  const notification = await Notification.findById(notificationId);
  return notification;
};

exports.getNotifications = async (userId) => {
  const notifications = await Notification.find({ receiverId: userId });
  return notifications;
};

exports.getSentNotifications = async (senderEmail) => {
  const notifications = await Notification.find({ senderEmail });
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

exports.getNotificationsByReceiverEmail = async (email) => {
  const notifications = await Notification.find({ receiverEmail: email });
  return notifications;
};

exports.getNotificationsBySenderEmail = async (email) => {
  const notifications = await Notification.find({ senderEmail: email });
  return notifications;
};
