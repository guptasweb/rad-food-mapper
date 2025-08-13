import { Request, Response } from 'express';
import { searchByStreet } from '../services/foodTrucksService';

export async function getStreets(req: Request, res: Response) {
  const query = String(req.query.query || '').trim();
  if (!query) return res.status(400).json({ message: 'Query parameter "query" is required' });
  const results = await searchByStreet({ query });
  return res.json(results);
}

