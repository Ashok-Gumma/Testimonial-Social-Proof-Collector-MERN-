import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { User } from '../models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyRefreshToken,
} from '../utils/tokens';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = signupSchema.parse(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({ success: false, message: 'User with this email already exists.' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verified: false,
    verificationToken,
    refreshTokens: [],
  });

  const payload = { userId: (user._id as any).toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshTokens.push(refreshToken);
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Account created successfully! Check simulated verification link.',
    accessToken,
    user: user.toJSON(),
    simulationLink: `/verify-email?token=${verificationToken}`,
  });
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const token = req.query.token as string || req.body.token;
  if (!token) {
    res.status(400).json({ success: false, message: 'Verification token is required.' });
    return;
  }

  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
    return;
  }

  user.verified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully!',
    user: user.toJSON(),
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user || !user.password) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const payload = { userId: (user._id as any).toString(), email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Rotation: limit saved refresh tokens to last 5 sessions
  user.refreshTokens = [...user.refreshTokens.slice(-4), refreshToken];
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully.',
    accessToken,
    user: user.toJSON(),
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ success: false, message: 'Refresh token cookie missing.' });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      clearRefreshTokenCookie(res);
      res.status(401).json({ success: false, message: 'Invalid refresh token.' });
      return;
    }

    // Refresh Token Rotation: issue new pair
    const newPayload = { userId: (user._id as any).toString(), email: user.email };
    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    // Keep active tokens limited to last 5 sessions
    // Retain recent tokens so near-simultaneous requests or multi-tab reloads do not collide
    const updatedTokens = user.refreshTokens.includes(newRefreshToken)
      ? user.refreshTokens
      : [...user.refreshTokens.slice(-4), newRefreshToken];

    await User.updateOne(
      { _id: user._id },
      { $set: { refreshTokens: updatedTokens } }
    );

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: user.toJSON(),
    });
  } catch (err: any) {
    console.error('Refresh token error:', err?.message || err);
    clearRefreshTokenCookie(res);
    res.status(401).json({ success: false, message: 'Expired or malformed refresh token.' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'Email address is required.' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Return success to avoid email enumeration
    res.status(200).json({
      success: true,
      message: 'If an account exists for this email, password reset instructions have been generated.',
    });
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset link generated successfully.',
    resetLink: `/reset-password/${resetToken}`,
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    res.status(400).json({ success: false, message: 'Token and new password are required.' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    return;
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = []; // Revoke active sessions for security
  await user.save();

  clearRefreshTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Password reset successfully! Please log in with your new password.',
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.userId);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
      }
    } catch (e) {
      // Ignore token verification errors during logout
    }
  }

  clearRefreshTokenCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }
  res.status(200).json({ success: true, user: user.toJSON() });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const { name, avatar } = req.body;
  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;

  if (req.file) {
    user.avatar = `/uploads/${req.file.filename}`;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: user.toJSON(),
  });
};
