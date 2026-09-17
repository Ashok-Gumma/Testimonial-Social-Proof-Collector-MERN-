import { Router } from 'express';
import {
  createSpace,
  getSpaces,
  getSpaceById,
  getSpaceBySlug,
  updateSpace,
  deleteSpace,
  seedDemoSpaces,
} from '../controllers/spaceController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public space route for submission form & Wall of Love
router.get('/public/:slug', getSpaceBySlug);

// Protected Space routes
router.use(authenticate);
router.get('/', getSpaces);
router.post('/seed-demo', seedDemoSpaces);
router.post('/', upload.single('logo'), createSpace);
router.get('/:id', getSpaceById);
router.patch('/:id', upload.single('logo'), updateSpace);
router.delete('/:id', deleteSpace);

export default router;

