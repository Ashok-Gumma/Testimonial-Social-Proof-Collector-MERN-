import { Response } from 'express';
import { z } from 'zod';
import { Space } from '../models/Space';
import { Testimonial } from '../models/Testimonial';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { seedDemoForUser } from '../utils/seeder';


const spaceSchema = z.object({
  name: z.string().min(2, 'Space name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  headerTitle: z.string().optional(),
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
  requireAvatar: z.boolean().optional(),
  enableRating: z.boolean().optional(),
  customQuestions: z.array(z.string()).optional(),
  accentColor: z.string().optional(),
  logo: z.string().optional(),
});

export const createSpace = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const data = spaceSchema.parse({
    ...req.body,
    customQuestions: typeof req.body.customQuestions === 'string'
      ? JSON.parse(req.body.customQuestions)
      : req.body.customQuestions,
    requireAvatar: req.body.requireAvatar === 'true' || req.body.requireAvatar === true,
    enableRating: req.body.enableRating === 'true' || req.body.enableRating === true,
  });

  const existingSlug = await Space.findOne({ slug: data.slug });
  if (existingSlug) {
    res.status(400).json({ success: false, message: 'This space slug is already taken. Please choose another.' });
    return;
  }

  let logoUrl = data.logo || '';
  if (req.file) {
    logoUrl = `/uploads/${req.file.filename}`;
  }

  const space = await Space.create({
    ownerId: userId,
    name: data.name,
    slug: data.slug.toLowerCase(),
    headerTitle: data.headerTitle || 'Header Title',
    prompt: data.prompt,
    requireAvatar: data.requireAvatar ?? false,
    enableRating: data.enableRating ?? true,
    customQuestions: data.customQuestions || [],
    accentColor: data.accentColor || '#6366f1',
    logo: logoUrl,
  });

  res.status(201).json({
    success: true,
    message: 'Space created successfully!',
    space,
  });
};

export const getSpaces = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized. User session missing.' });
      return;
    }

    const spaces = await Space.find({ ownerId: userId }).sort({ createdAt: -1 });

    if (!spaces || spaces.length === 0) {
      res.status(200).json({ success: true, spaces: [] });
      return;
    }

    // Attach aggregate statistics for each space
    const spaceIds = spaces.map((s) => s._id);

    const stats = await Testimonial.aggregate([
      { $match: { spaceId: { $in: spaceIds } } },
      {
        $group: {
          _id: '$spaceId',
          totalReviews: { $sum: 1 },
          approvedReviews: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          pendingReviews: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const statsMap = new Map();
    if (stats && Array.isArray(stats)) {
      stats.forEach((st) => {
        if (st && st._id) {
          statsMap.set(st._id.toString(), st);
        }
      });
    }

    const enrichedSpaces = spaces.map((space) => {
      const spaceStat = statsMap.get(space._id.toString()) || {
        totalReviews: 0,
        approvedReviews: 0,
        pendingReviews: 0,
        avgRating: 5.0,
      };

      return {
        ...space.toObject(),
        totalReviews: spaceStat.totalReviews ?? 0,
        approvedReviews: spaceStat.approvedReviews ?? 0,
        pendingReviews: spaceStat.pendingReviews ?? 0,
        avgRating: spaceStat.avgRating ? Number(spaceStat.avgRating.toFixed(1)) : 5.0,
      };
    });

    res.status(200).json({
      success: true,
      spaces: enrichedSpaces,
    });
  } catch (error: any) {
    console.error('❌ Error in getSpaces:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve spaces.',
    });
  }
};

export const getSpaceById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const space = await Space.findOne({ _id: id, ownerId: userId });
  if (!space) {
    res.status(404).json({ success: false, message: 'Space not found or access denied.' });
    return;
  }

  res.status(200).json({ success: true, space });
};

// PUBLIC access for Collection Form & Wall of Love
export const getSpaceBySlug = async (req: any, res: Response): Promise<void> => {
  const { slug } = req.params;

  const space = await Space.findOne({ slug: slug.toLowerCase() });
  if (!space) {
    res.status(404).json({ success: false, message: 'Space not found with the provided slug.' });
    return;
  }

  res.status(200).json({
    success: true,
    space: {
      _id: space._id,
      name: space.name,
      slug: space.slug,
      logo: space.logo,
      headerTitle: space.headerTitle,
      prompt: space.prompt,
      requireAvatar: space.requireAvatar,
      enableRating: space.enableRating,
      customQuestions: space.customQuestions,
      accentColor: space.accentColor,
    },
  });
};

export const updateSpace = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const space = await Space.findOne({ _id: id, ownerId: userId });
  if (!space) {
    res.status(404).json({ success: false, message: 'Space not found or access denied.' });
    return;
  }

  const data = spaceSchema.partial().parse({
    ...req.body,
    customQuestions: typeof req.body.customQuestions === 'string'
      ? JSON.parse(req.body.customQuestions)
      : req.body.customQuestions,
    requireAvatar: req.body.requireAvatar !== undefined
      ? (req.body.requireAvatar === 'true' || req.body.requireAvatar === true)
      : undefined,
    enableRating: req.body.enableRating !== undefined
      ? (req.body.enableRating === 'true' || req.body.enableRating === true)
      : undefined,
  });

  if (data.slug && data.slug !== space.slug) {
    const slugExists = await Space.findOne({ slug: data.slug, _id: { $ne: id } });
    if (slugExists) {
      res.status(400).json({ success: false, message: 'This slug is already taken by another space.' });
      return;
    }
    space.slug = data.slug.toLowerCase();
  }

  if (data.name) space.name = data.name;
  if (data.headerTitle !== undefined) space.headerTitle = data.headerTitle;
  if (data.prompt) space.prompt = data.prompt;
  if (data.requireAvatar !== undefined) space.requireAvatar = data.requireAvatar;
  if (data.enableRating !== undefined) space.enableRating = data.enableRating;
  if (data.customQuestions) space.customQuestions = data.customQuestions;
  if (data.accentColor) space.accentColor = data.accentColor;

  if (req.file) {
    space.logo = `/uploads/${req.file.filename}`;
  } else if (data.logo !== undefined) {
    space.logo = data.logo;
  }

  await space.save();

  res.status(200).json({
    success: true,
    message: 'Space updated successfully!',
    space,
  });
};

export const deleteSpace = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const space = await Space.findOneAndDelete({ _id: id, ownerId: userId });
  if (!space) {
    res.status(404).json({ success: false, message: 'Space not found or access denied.' });
    return;
  }

  // Delete associated testimonials
  await Testimonial.deleteMany({ spaceId: id });

  res.status(200).json({
    success: true,
    message: 'Space and associated testimonials deleted successfully.',
  });
};

export const seedDemoSpaces = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized. User session missing.' });
      return;
    }

    const result = await seedDemoForUser(userId);

    res.status(200).json({
      success: true,
      message: `Demo spaces and testimonials generated successfully!`,
      result,
    });
  } catch (error: any) {
    console.error('Error generating demo spaces:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to seed demo spaces.' });
  }
};

