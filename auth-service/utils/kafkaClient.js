const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'gmail-clone',
  brokers: ['kafka:9092'],
});

module.exports = kafka;
