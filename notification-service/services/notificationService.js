const { HTTP_STATUS } = require("../utils/constants");
const notificationRepository = require("../repositories/notificationRepository");

exports.createNotification = async (notification) => {
  if (
    !notification.receiverEmail ||
    !notification.senderEmail ||
    !notification.senderName ||
    !notification.receiverName ||
    !notification.content ||
    !notification.title ||
    !notification.category
  ) {
    const error = new Error("Missing required fields");
    error.status = HTTP_STATUS.BAD_REQUEST;
    throw error;
  }
  const createdNotification = await notificationRepository.createNotification(
    notification
  );
  return createdNotification;
};

exports.findNotification = async (notificationId) => {
  const notification = await notificationRepository.getNotification(notificationId);
  return notification;
};

exports.findNotificationsBySenderEmail = async (senderEmail) => {
  const notifications = await notificationRepository.getSentNotifications(senderEmail);
  return notifications;
};

exports.findUserNotifications = async (email) => {
  const notifications = await notificationRepository.getNotificationsByReceiverEmail(email);
  const sentNotifications = await notificationRepository.getNotificationsBySenderEmail(email);
  notifications.push(...sentNotifications);
  return notifications;
};

exports.updateNotification = async (notificationId, update) => {
  const updatedNotification = await notificationRepository.updateNotification(
    notificationId,
    update
  );
  return updatedNotification;
};

exports.deleteNotification = async (notificationId) => {
  const deletedNotification = await notificationRepository.deleteNotification(
    notificationId
  );
  return deletedNotification;
};

exports.searchNotifications = async (email, query) => {
  return notificationRepository.searchNotifications(email, query);
};

