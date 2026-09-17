import { Request, Response } from 'express';
import { z } from 'zod';
import { Testimonial, TestimonialStatus } from '../models/Testimonial';
import { Space } from '../models/Space';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const testimonialSubmissionSchema = z.object({
  spaceSlug: z.string().min(1, 'Space slug is required'),
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  companyRole: z.string().optional(),
  avatar: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).default(5),
  review: z.string().min(5, 'Review must be at least 5 characters long'),
  customAnswers: z.union([z.string(), z.array(z.object({ question: z.string(), answer: z.string() }))]).optional(),
});

export const submitTestimonial = async (req: Request, res: Response): Promise<void> => {
  let parsedAnswers: any[] = [];
  if (req.body.customAnswers) {
    if (typeof req.body.customAnswers === 'string') {
      try {
        parsedAnswers = JSON.parse(req.body.customAnswers);
      } catch (e) {
        parsedAnswers = [];
      }
    } else if (Array.isArray(req.body.customAnswers)) {
      parsedAnswers = req.body.customAnswers;
    }
  }

  const data = testimonialSubmissionSchema.parse({
    ...req.body,
    customAnswers: parsedAnswers,
  });

  const space = await Space.findOne({ slug: data.spaceSlug.toLowerCase() });
  if (!space) {
    res.status(404).json({ success: false, message: 'Target space not found.' });
    return;
  }

  let avatarUrl = data.avatar || '';
  if (req.file) {
    avatarUrl = `/uploads/${req.file.filename}`;
  }

  if (space.requireAvatar && !avatarUrl) {
    res.status(400).json({ success: false, message: 'An avatar photo is required by this space.' });
    return;
  }

  // If no avatar uploaded/provided, generate UI avatar based on client name
  if (!avatarUrl) {
    const nameEncoded = encodeURIComponent(data.clientName);
    avatarUrl = `https://ui-avatars.com/api/?name=${nameEncoded}&background=6366f1&color=fff&size=128`;
  }

  const testimonial = await Testimonial.create({
    spaceId: space._id,
    clientName: data.clientName,
    email: data.email,
    companyRole: data.companyRole || '',
    avatar: avatarUrl,
    rating: space.enableRating ? data.rating : 5,
    review: data.review,
    customAnswers: parsedAnswers,
    status: 'pending',
    featured: false,
    liked: false,
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your testimonial has been submitted successfully for moderation.',
    testimonial,
  });
};

// PUBLIC API for Wall of Love & Embed Widgets
export const getPublicTestimonials = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const { featured, rating, limit = 50 } = req.query;

  const space = await Space.findOne({ slug: (slug as string).toLowerCase() });
  if (!space) {
    res.status(404).json({ success: false, message: 'Space not found.' });
    return;
  }

  const filter: any = {
    spaceId: space._id,
    status: 'approved',
  };

  if (featured === 'true') {
    filter.featured = true;
  }

  if (rating) {
    filter.rating = Number(rating);
  }

  const testimonials = await Testimonial.find(filter)
    .sort({ featured: -1, createdAt: -1 })
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    space: {
      name: space.name,
      slug: space.slug,
      logo: space.logo,
      headerTitle: space.headerTitle,
      accentColor: space.accentColor,
    },
    count: testimonials.length,
    testimonials,
  });
};

// PROTECTED API for Moderation Inbox
export const getSpaceTestimonials = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { spaceId } = req.params;
  const userId = req.user?.userId;
  const { status, rating, search, sort = 'newest', page = 1, limit = 20 } = req.query;

  // Verify ownership of the space
  const space = await Space.findOne({ _id: spaceId, ownerId: userId });
  if (!space) {
    res.status(404).json({ success: false, message: 'Space not found or access denied.' });
    return;
  }

  const queryFilter: any = { spaceId };

  if (status && status !== 'all') {
    queryFilter.status = status;
  }

  if (rating && rating !== 'all') {
    queryFilter.rating = Number(rating);
  }

  if (search) {
    const escapedSearch = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i');
    queryFilter.$or = [
      { clientName: searchRegex },
      { email: searchRegex },
      { companyRole: searchRegex },
      { review: searchRegex },
    ];
  }


  let sortOptions: any = { createdAt: -1 };
  if (sort === 'oldest') {
    sortOptions = { createdAt: 1 };
  } else if (sort === 'rating-desc') {
    sortOptions = { rating: -1, createdAt: -1 };
  } else if (sort === 'rating-asc') {
    sortOptions = { rating: 1, createdAt: -1 };
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const total = await Testimonial.countDocuments(queryFilter);
  const testimonials = await Testimonial.find(queryFilter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum);

  // Also get counts by status for inbox tab badges
  const statusCounts = await Testimonial.aggregate([
    { $match: { spaceId: space._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const countsObj: Record<string, number> = {
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
  };

  statusCounts.forEach((item) => {
    countsObj[item._id] = item.count;
    countsObj.all += item.count;
  });

  res.status(200).json({
    success: true,
    testimonials,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    },
    counts: countsObj,
  });
};

export const updateTestimonialStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user?.userId;

  if (!['pending', 'approved', 'rejected', 'archived'].includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid status value.' });
    return;
  }

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    res.status(404).json({ success: false, message: 'Testimonial not found.' });
    return;
  }

  // Ensure user owns space
  const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: userId });
  if (!space) {
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }

  testimonial.status = status as TestimonialStatus;
  await testimonial.save();

  res.status(200).json({
    success: true,
    message: `Testimonial status updated to ${status}.`,
    testimonial,
  });
};

export const toggleFeature = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    res.status(404).json({ success: false, message: 'Testimonial not found.' });
    return;
  }

  const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: userId });
  if (!space) {
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }

  testimonial.featured = !testimonial.featured;
  await testimonial.save();

  res.status(200).json({
    success: true,
    message: testimonial.featured ? 'Testimonial marked as featured!' : 'Testimonial unfeatured.',
    testimonial,
  });
};

export const toggleLike = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    res.status(404).json({ success: false, message: 'Testimonial not found.' });
    return;
  }

  const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: userId });
  if (!space) {
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }

  testimonial.liked = !testimonial.liked;
  await testimonial.save();

  res.status(200).json({
    success: true,
    message: testimonial.liked ? 'Liked testimonial.' : 'Unliked testimonial.',
    testimonial,
  });
};

export const bulkActionTestimonials = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { ids, action } = req.body;
  const userId = req.user?.userId;

  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400).json({ success: false, message: 'No testimonial IDs provided.' });
    return;
  }

  // Find testimonials and verify space ownership
  const testimonials = await Testimonial.find({ _id: { $in: ids } });
  const spaceIds = [...new Set(testimonials.map((t) => t.spaceId.toString()))];

  const userSpaces = await Space.find({ _id: { $in: spaceIds }, ownerId: userId });
  const validSpaceIds = new Set(userSpaces.map((s) => (s._id as any).toString()));

  const authorizedIds = testimonials
    .filter((t) => validSpaceIds.has(t.spaceId.toString()))
    .map((t) => t._id);

  if (authorizedIds.length === 0) {
    res.status(403).json({ success: false, message: 'No authorized testimonials found for bulk action.' });
    return;
  }

  if (action === 'delete') {
    await Testimonial.deleteMany({ _id: { $in: authorizedIds } });
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${authorizedIds.length} testimonials.`,
    });
    return;
  }

  if (['approve', 'reject', 'archive'].includes(action)) {
    const statusMap: Record<string, TestimonialStatus> = {
      approve: 'approved',
      reject: 'rejected',
      archive: 'archived',
    };

    await Testimonial.updateMany(
      { _id: { $in: authorizedIds } },
      { $set: { status: statusMap[action] } }
    );

    res.status(200).json({
      success: true,
      message: `Successfully updated ${authorizedIds.length} testimonials to ${statusMap[action]}.`,
    });
    return;
  }

  res.status(400).json({ success: false, message: 'Invalid bulk action specified.' });
};

export const deleteTestimonial = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    res.status(404).json({ success: false, message: 'Testimonial not found.' });
    return;
  }

  const space = await Space.findOne({ _id: testimonial.spaceId, ownerId: userId });
  if (!space) {
    res.status(403).json({ success: false, message: 'Access denied.' });
    return;
  }

  await Testimonial.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Testimonial deleted successfully.',
  });
};
