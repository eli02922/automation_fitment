import { Request, Response, NextFunction } from 'express';
import * as fitmentService from '../services/fitmentService';

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await fitmentService.searchFitments(res.locals.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const fitment = await fitmentService.getFitmentById(Number(req.params.id));
    if (!fitment) return res.status(404).json({ error: 'NotFound' });
    res.json(fitment);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const fitment = await fitmentService.createFitment(req.body);
    res.status(201).json(fitment);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const fitment = await fitmentService.updateFitment(Number(req.params.id), req.body);
    if (!fitment) return res.status(404).json({ error: 'NotFound' });
    res.json(fitment);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const fitment = await fitmentService.deactivateFitment(Number(req.params.id));
    if (!fitment) return res.status(404).json({ error: 'NotFound' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
