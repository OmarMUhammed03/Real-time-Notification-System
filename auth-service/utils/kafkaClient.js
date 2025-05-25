const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'gmail-clone',
  brokers: ['localhost:9092'],
});

module.exports = kafka;
