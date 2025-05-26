const { createConsumer, startConsumer } = require("../utils/kafkaConsumer");
const notificationService = require("../services/notificationService");

async function handleNotificationEvent(io, onlineUsers) {
  return async ({ message }) => {
    try {
      console.log("Processing notification event...", message);
      const event = JSON.parse(message.value.toString());
      await notificationService.createNotification({ ...event });

      const { receiverId } = event;
      if (receiverId && onlineUsers.has(receiverId)) {
        const socketId = onlineUsers.get(receiverId);
        io.to(socketId).emit("notification", event);
        console.log("notification sent to the reciever");
      } else {
        console.log("User not online");
      }
    } catch (err) {
      console.error("Failed to process notification event:", err.message);
    }
  };
}

async function startNotificationEventConsumer(io, onlineUsers) {
  const consumer = createConsumer("notification-service-group");
  const runner = await handleNotificationEvent(io, onlineUsers);
  await startConsumer(consumer, "notification", runner);
}

module.exports = { startNotificationEventConsumer };
