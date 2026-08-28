import { Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from './logger';

/**
 * Sequelize connection targeting SQL Server by default.
 * Switch DB_DIALECT=oracle (with oracledb driver installed) to repoint at Oracle
 * without changing model/service code.
 */
export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: env.db.dialect,
  logging: env.nodeEnv === 'development' ? (sql) => logger.debug(sql) : false,
  pool: {
    max: env.db.poolMax,
    min: env.db.poolMin,
    idle: 10_000,
    acquire: 30_000,
  },
  dialectOptions:
    env.db.dialect === 'mssql'
      ? {
          options: {
            encrypt: env.db.encrypt,
            trustServerCertificate: !env.db.encrypt,
          },
        }
      : undefined,
});

export async function connectDatabase(): Promise<void> {
  await sequelize.authenticate();
  logger.info({ dialect: env.db.dialect, host: env.db.host }, 'Database connection established');
}
