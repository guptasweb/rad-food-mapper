import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getNearest } from '../../controllers/nearestController';

const router = Router();

// GET /api/v1/nearest?lat=37.78&lng=-122.41&status=ALL
router.get('/', asyncHandler(getNearest));

export default router;

