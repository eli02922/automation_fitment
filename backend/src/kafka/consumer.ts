import { EachMessagePayload } from 'kafkajs';
import { kafka } from './client';
import { env } from '../config/env';
import { logger } from '../config/logger';
import type { FitmentEvent } from './producer';

/**
 * Handles downstream processing of fitment domain events (search-index sync,
 * cache invalidation, notifying dependent enterprise applications, etc.).
 */
async function handleFitmentEvent(event: FitmentEvent): Promise<void> {
  logger.info({ type: event.type, fitmentId: event.fitmentId }, 'Processing fitment event');
  // TODO: plug in downstream consumers (search index, cache, notifications).
}

async function processMessage({ message }: EachMessagePayload): Promise<void> {
  if (!message.value) return;
  try {
    const event = JSON.parse(message.value.toString()) as FitmentEvent;
    await handleFitmentEvent(event);
  } catch (err) {
    logger.error({ err }, 'Failed to process fitment event message');
  }
}

export async function startFitmentConsumer(): Promise<void> {
  const consumer = kafka.consumer({ groupId: env.kafka.groupId });
  await consumer.connect();
  await consumer.subscribe({ topic: env.kafka.fitmentTopic, fromBeginning: false });
  await consumer.run({ eachMessage: processMessage });
  logger.info({ topic: env.kafka.fitmentTopic, groupId: env.kafka.groupId }, 'Kafka consumer running');
}

if (require.main === module) {
  startFitmentConsumer().catch((err) => {
    logger.error({ err }, 'Fitment consumer failed to start');
    process.exit(1);
  });
}
