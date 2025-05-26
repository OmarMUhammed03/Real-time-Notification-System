const { HTTP_STATUS } = require("../utils/constants");
const notificationRepository = require("../repositories/notificationRepository");

exports.createNotification = async (notification) => {
  if (
    !notification.receiverId ||
    !notification.senderId ||
    !notification.message ||
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
