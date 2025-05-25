const kafka = require('./kafkaClient');

function createConsumer(groupId) {
  return kafka.consumer({ groupId });
}

async function startConsumer(consumer, topic, onMessage) {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        await onMessage({ topic, partition, message });
      },
    });
  } catch (err) {
    console.error(`Kafka consumer error (topic: ${topic}):`, err.message);
  }
}


module.exports = { createConsumer, startConsumer };
