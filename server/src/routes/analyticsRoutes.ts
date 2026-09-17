import { Router } from 'express';
import { getSpaceAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/space/:spaceId', getSpaceAnalytics);

export default router;
