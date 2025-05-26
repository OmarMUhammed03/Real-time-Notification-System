const { HTTP_STATUS } = require("../utils/constants");
const notificationRepository = require("../repositories/notificationRepository");

exports.createNotification = async (notification) => {
  if (
    !notification.receiverId ||
    !notification.senderId ||
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

exports.findNotificationsBySenderId = async (senderId) => {
  const notifications = await notificationRepository.getSentNotifications(senderId);
  return notifications;
};

exports.findNotificationsByReceiverId = async (receiverId) => {
  const notifications = await notificationRepository.getNotifications(receiverId);
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

