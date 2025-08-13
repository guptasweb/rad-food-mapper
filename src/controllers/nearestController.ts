import { Request, Response } from 'express';
import { findNearest } from '../services/foodTrucksService';

export async function getNearest(req: Request, res: Response) {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const status = req.query.status ? String(req.query.status) : 'APPROVED';
  const limit = req.query.limit ? Number(req.query.limit) : 5;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ message: 'Query parameters "lat" and "lng" are required and must be numbers' });
  }
  if (!Number.isFinite(limit) || limit <= 0) {
    return res.status(400).json({ message: 'Query parameter "limit" must be a positive number' });
  }

  const results = await findNearest({ lat, lng, limit, status });
  return res.json(results);
}

