import { Kafka, logLevel } from 'kafkajs';
import { env } from '../config/env';

export const kafka = new Kafka({
  clientId: env.kafka.clientId,
  brokers: env.kafka.brokers,
  ssl: env.kafka.ssl,
  logLevel: logLevel.WARN,
  retry: { initialRetryTime: 300, retries: 8 },
});
