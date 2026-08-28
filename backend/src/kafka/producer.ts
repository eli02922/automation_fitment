import { Producer } from 'kafkajs';
import { kafka } from './client';
import { env } from '../config/env';
import { logger } from '../config/logger';

let producer: Producer | undefined;

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = kafka.producer({ allowAutoTopicCreation: false, idempotent: true });
    await producer.connect();
    logger.info('Kafka producer connected');
  }
  return producer;
}

export type FitmentEventType = 'fitment.created' | 'fitment.updated' | 'fitment.deleted';

export interface FitmentEvent {
  type: FitmentEventType;
  fitmentId: number;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export async function publishFitmentEvent(event: FitmentEvent): Promise<void> {
  const client = await getProducer();
  await client.send({
    topic: env.kafka.fitmentTopic,
    messages: [
      {
        key: String(event.fitmentId),
        value: JSON.stringify(event),
      },
    ],
  });
  logger.debug({ event }, 'Published fitment event');
}

export async function disconnectProducer(): Promise<void> {
  if (producer) {
    await producer.disconnect();
    producer = undefined;
  }
}
