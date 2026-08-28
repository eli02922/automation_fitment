import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase } from './config/database';
import { scheduleFitmentSyncJob } from './batch/fitmentSyncJob';

async function bootstrap() {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    logger.info({ port: env.port }, 'Fitment catalog backend listening');
  });

  scheduleFitmentSyncJob();

  const shutdown = (signal: string) => {
    logger.info({ signal }, 'Shutting down server');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Failed to start server');
  process.exit(1);
});
