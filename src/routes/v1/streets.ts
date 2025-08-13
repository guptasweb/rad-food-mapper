import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getStreets } from '../../controllers/streetsController';

const router = Router();

// GET /api/v1/streets?query=SAN
router.get('/', asyncHandler(getStreets));

export default router;

