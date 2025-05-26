const { create } = require("../models/Notification");
const kafka = require("./kafkaClient");
const producer = kafka.producer();

let isConnected = false;

async function connectProducer() {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
    console.log("Kafka producer connected");
  }
}

async function sendEvent(topic, messages) {
  if (!isConnected) {
    await connectProducer();
  }

  await producer.send({ topic, messages });
}

async function sendNotification(event) {
  await sendEvent("notification", [
    {
      value: JSON.stringify({
        ...event,
        category: "inbox",
        createdAt: new Date(),
        isRead: false,
      }),
    },
  ]);
}

process.on("SIGINT", async () => {
  if (isConnected) {
    await producer.disconnect();
    console.log("Kafka producer disconnected");
  }
  process.exit();
});

module.exports = { sendEvent, sendNotification };
