const { createConsumer, startConsumer } = require("../../utils/kafkaConsumer");
const userService = require("../services/userService");

async function handleUserRegistered({ message }) {
  const event = JSON.parse(message.value.toString());
  const { userId, ...body } = event;
  await userService.createUser({ _id: userId, ...body });
}

async function startUserEventsConsumer() {
  const consumer = createConsumer("user-service-group");
  await startConsumer(consumer, "userRegistered", handleUserRegistered);
}

startUserEventsConsumer();
