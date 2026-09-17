import { Router } from 'express';
import {
  signup,
  verifyEmail,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  logout,
  me,
  updateProfile,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);

// Protected Auth Routes
router.get('/me', authenticate, me);
router.patch('/profile', authenticate, upload.single('avatar'), updateProfile);

export default router;
