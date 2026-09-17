import { Router } from 'express';
import {
  submitTestimonial,
  getPublicTestimonials,
  getSpaceTestimonials,
  updateTestimonialStatus,
  toggleFeature,
  toggleLike,
  bulkActionTestimonials,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public routes for submission form & Wall of Love
router.post('/submit', upload.single('avatar'), submitTestimonial);
router.get('/public/:slug', getPublicTestimonials);

// Protected Moderation & Management routes
router.use(authenticate);
router.get('/space/:spaceId', getSpaceTestimonials);
router.patch('/:id/status', updateTestimonialStatus);
router.patch('/:id/feature', toggleFeature);
router.patch('/:id/like', toggleLike);
router.post('/bulk', bulkActionTestimonials);
router.delete('/:id', deleteTestimonial);

export default router;
