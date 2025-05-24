const kafka = require('./kafkaClient');

function createConsumer(groupId) {
  return kafka.consumer({ groupId });
}

async function startConsumer(consumer, topic, onMessage) {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await onMessage({ topic, partition, message });
    },
  });
}

module.exports = { createConsumer, startConsumer };
