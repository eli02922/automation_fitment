import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),

  db: {
    dialect: (process.env.DB_DIALECT ?? 'mssql') as 'mssql' | 'oracle',
    host: required('DB_HOST', 'localhost'),
    port: Number(process.env.DB_PORT ?? 1433),
    name: required('DB_NAME', 'fitment_catalog'),
    user: required('DB_USER', 'sa'),
    password: required('DB_PASSWORD', ''),
    encrypt: process.env.DB_ENCRYPT === 'true',
    poolMax: Number(process.env.DB_POOL_MAX ?? 20),
    poolMin: Number(process.env.DB_POOL_MIN ?? 2),
  },

  oracle: {
    connectString: process.env.ORACLE_CONNECT_STRING ?? '',
    user: process.env.ORACLE_USER ?? '',
    password: process.env.ORACLE_PASSWORD ?? '',
  },

  kafka: {
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
    clientId: process.env.KAFKA_CLIENT_ID ?? 'fitment-catalog-backend',
    groupId: process.env.KAFKA_GROUP_ID ?? 'fitment-catalog-consumers',
    fitmentTopic: process.env.KAFKA_FITMENT_TOPIC ?? 'fitment.events',
    ssl: process.env.KAFKA_SSL === 'true',
  },

  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',

  etl: {
    batchSize: Number(process.env.ETL_BATCH_SIZE ?? 1000),
    cronSchedule: process.env.ETL_CRON_SCHEDULE ?? '0 */2 * * *',
  },
};
