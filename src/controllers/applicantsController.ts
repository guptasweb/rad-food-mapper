import { Request, Response } from 'express';
import { searchByApplicant } from '../services/foodTrucksService';

export async function getApplicants(req: Request, res: Response) {
  const name = String(req.query.name || '').trim();
  const status = req.query.status ? String(req.query.status) : undefined;
  if (!name) return res.status(400).json({ message: 'Query parameter "name" is required' });
  const results = await searchByApplicant({ name, status });
  return res.json(results);
}

