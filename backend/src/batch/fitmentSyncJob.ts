import cron from 'node-cron';
import { QueryTypes } from 'sequelize';
import { sequelize, connectDatabase } from '../config/database';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { Fitment } from '../models/Fitment';

interface StagingFitmentRow {
  part_number: string;
  make: string;
  model: string;
  year_start: number;
  year_end: number;
  trim: string | null;
  engine: string | null;
  drive_type: string | null;
  body_type: string | null;
  source_system: string;
}

/**
 * Enterprise ETL: pulls batches of staged fitment records (e.g. from a
 * supplier/partner staging table) and upserts them into the catalog,
 * synchronizing high-volume fitment data on a schedule.
 */
export async function runFitmentSyncBatch(): Promise<{ processed: number }> {
  let processed = 0;
  let offset = 0;

  // Replace with the real staging source (linked server, file drop, external DB, etc.)
  const fetchBatch = async (limit: number, skip: number): Promise<StagingFitmentRow[]> =>
    sequelize.query<StagingFitmentRow>(
      `SELECT part_number, make, model, year_start, year_end, trim, engine, drive_type, body_type, source_system
       FROM staging_fitments
       ORDER BY id
       OFFSET :skip ROWS FETCH NEXT :limit ROWS ONLY`,
      { replacements: { skip, limit }, type: QueryTypes.SELECT },
    );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const rows = await fetchBatch(env.etl.batchSize, offset);
    if (rows.length === 0) break;

    await sequelize.transaction(async (transaction) => {
      for (const row of rows) {
        await Fitment.upsert(
          {
            partNumber: row.part_number,
            make: row.make,
            model: row.model,
            yearStart: row.year_start,
            yearEnd: row.year_end,
            trim: row.trim,
            engine: row.engine,
            driveType: row.drive_type,
            bodyType: row.body_type,
            source: row.source_system,
            isActive: true,
          },
          { transaction },
        );
      }
    });

    processed += rows.length;
    offset += rows.length;
    logger.info({ processed }, 'Fitment sync batch progress');
  }

  logger.info({ processed }, 'Fitment sync batch complete');
  return { processed };
}

export function scheduleFitmentSyncJob(): void {
  cron.schedule(env.etl.cronSchedule, () => {
    runFitmentSyncBatch().catch((err) => logger.error({ err }, 'Fitment sync batch failed'));
  });
  logger.info({ schedule: env.etl.cronSchedule }, 'Fitment sync job scheduled');
}

if (require.main === module) {
  connectDatabase()
    .then(() => runFitmentSyncBatch())
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error({ err }, 'Fitment sync batch run failed');
      process.exit(1);
    });
}
