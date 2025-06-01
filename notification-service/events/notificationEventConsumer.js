const { createConsumer } = require("../utils/kafkaConsumer");
const notificationService = require("../services/notificationService");

async function handleUserNameUpdatedEvent(message) {
  try {
    const event = JSON.parse(message.value.toString());
    const { email, name: newName } = event;
    await notificationService.updateUserNameInNotifications(email, newName);
    console.log(
      `Updated notifications for user email: ${email} to new name: ${newName}`
    );
  } catch (err) {
    console.error("Failed to process userNameUpdated event:", err.message);
  }
}

async function startNotificationEventConsumer() {
  const userNameConsumer = createConsumer(
    "notification-service-group-username"
  );
  await userNameConsumer.connect();
  await userNameConsumer.subscribe({
    topic: "userNameUpdated",
    fromBeginning: false,
  });
  await userNameConsumer.run({
    eachMessage: async ({ message }) => {
      await handleUserNameUpdatedEvent(message);
    },
  });
}

module.exports = { startNotificationEventConsumer };
