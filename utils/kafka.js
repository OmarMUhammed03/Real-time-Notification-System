const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'gmail-clone',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'gmail-clone-group' });

module.exports = { kafka, producer, consumer };
