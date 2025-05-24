const kafka = require('./kafkaClient');

const producer = kafka.producer();

async function connectProducer() {
  if (!producer.disconnect || !producer.disconnect()) {
    await producer.connect();
  }
}

async function sendEvent(topic, messages) {
  await connectProducer();
  await producer.send({ topic, messages });
}

module.exports = { producer, sendEvent };
