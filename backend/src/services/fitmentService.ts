import { Op } from 'sequelize';
import { Fitment, FitmentCreationAttributes } from '../models/Fitment';
import { publishFitmentEvent } from '../kafka/producer';

export interface FitmentSearchParams {
  make?: string;
  model?: string;
  year?: number;
  partNumber?: string;
  page?: number;
  pageSize?: number;
}

const MAX_PAGE_SIZE = 200;

export async function searchFitments(params: FitmentSearchParams) {
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(params.pageSize ?? 25, MAX_PAGE_SIZE);

  const where: Record<string, unknown> = { isActive: true };
  if (params.make) where.make = params.make;
  if (params.model) where.model = params.model;
  if (params.partNumber) where.partNumber = params.partNumber;
  if (params.year) {
    where.yearStart = { [Op.lte]: params.year };
    where.yearEnd = { [Op.gte]: params.year };
  }

  const { rows, count } = await Fitment.findAndCountAll({
    where,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    order: [['make', 'ASC'], ['model', 'ASC']],
  });

  return { items: rows, total: count, page, pageSize };
}

export async function getFitmentById(id: number) {
  return Fitment.findByPk(id);
}

export async function createFitment(data: FitmentCreationAttributes) {
  const fitment = await Fitment.create(data);
  await publishFitmentEvent({
    type: 'fitment.created',
    fitmentId: fitment.id,
    payload: fitment.toJSON(),
    occurredAt: new Date().toISOString(),
  });
  return fitment;
}

export async function updateFitment(id: number, data: Partial<FitmentCreationAttributes>) {
  const fitment = await Fitment.findByPk(id);
  if (!fitment) return null;
  await fitment.update(data);
  await publishFitmentEvent({
    type: 'fitment.updated',
    fitmentId: fitment.id,
    payload: fitment.toJSON(),
    occurredAt: new Date().toISOString(),
  });
  return fitment;
}

export async function deactivateFitment(id: number) {
  const fitment = await Fitment.findByPk(id);
  if (!fitment) return null;
  await fitment.update({ isActive: false });
  await publishFitmentEvent({
    type: 'fitment.deleted',
    fitmentId: fitment.id,
    payload: { id },
    occurredAt: new Date().toISOString(),
  });
  return fitment;
}
