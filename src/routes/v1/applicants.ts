import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { getApplicants } from '../../controllers/applicantsController';

const router = Router();

// GET /api/v1/applicants?name=foo&status=APPROVED
router.get('/', asyncHandler(getApplicants));

export default router;

