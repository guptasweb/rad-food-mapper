import { Router } from 'express';
import applicantRouter from './v1/applicants';
import streetRouter from './v1/streets';
import nearestRouter from './v1/nearest';

export const router = Router();

router.use('/v1/applicants', applicantRouter);
router.use('/v1/streets', streetRouter);
router.use('/v1/nearest', nearestRouter);

