const { createConsumer, startConsumer } = require("../utils/kafkaConsumer");
const userService = require("../services/userService");

async function handleUserRegistered({ message }) {
  try {
    const event = JSON.parse(message.value.toString());
    const { userId, ...body } = event;
    await userService.createUser({ _id: userId, ...body });
  } catch (err) {
    console.error("Error handling userRegistered event:", err.message);
  }
}

async function startUserEventsConsumer() {
  const consumer = createConsumer("user-service-group");

  try {
    await startConsumer(consumer, "userRegistered", handleUserRegistered);
    console.log("Kafka consumer started for 'userRegistered' events");

    process.on("SIGINT", async () => {
      console.log("Shutting down consumer...");
      await consumer.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("Shutting down consumer...");
      await consumer.disconnect();
      process.exit(0);
    });
  } catch (err) {
    console.error("Failed to start user events consumer:", err.message);
  }
}

startUserEventsConsumer();
