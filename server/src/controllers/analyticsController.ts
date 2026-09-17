import { Response } from 'express';
import { Space } from '../models/Space';
import { Testimonial } from '../models/Testimonial';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getSpaceAnalytics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { spaceId } = req.params;
  const userId = req.user?.userId;

  // If spaceId === 'all', aggregate across all spaces owned by the user
  let spaceFilter: any = {};
  if (spaceId !== 'all') {
    const space = await Space.findOne({ _id: spaceId, ownerId: userId });
    if (!space) {
      res.status(404).json({ success: false, message: 'Space not found or access denied.' });
      return;
    }
    spaceFilter = { spaceId: space._id };
  } else {
    const userSpaces = await Space.find({ ownerId: userId }).select('_id');
    const userSpaceIds = userSpaces.map((s) => s._id);
    spaceFilter = { spaceId: { $in: userSpaceIds } };
  }

  // 1. Overview KPIs
  const totalReviews = await Testimonial.countDocuments(spaceFilter);
  const pendingReviews = await Testimonial.countDocuments({ ...spaceFilter, status: 'pending' });
  const approvedReviews = await Testimonial.countDocuments({ ...spaceFilter, status: 'approved' });
  const featuredReviews = await Testimonial.countDocuments({ ...spaceFilter, featured: true });

  const avgRatingResult = await Testimonial.aggregate([
    { $match: spaceFilter },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } },
  ]);
  const averageRating = avgRatingResult.length > 0 && avgRatingResult[0].avgRating
    ? Number(avgRatingResult[0].avgRating.toFixed(1))
    : 5.0;

  // 2. Star Distribution (5, 4, 3, 2, 1)
  const starCountsResult = await Testimonial.aggregate([
    { $match: spaceFilter },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
  ]);

  const starDistribution: Record<number, { count: number; percentage: number }> = {
    5: { count: 0, percentage: 0 },
    4: { count: 0, percentage: 0 },
    3: { count: 0, percentage: 0 },
    2: { count: 0, percentage: 0 },
    1: { count: 0, percentage: 0 },
  };

  starCountsResult.forEach((item) => {
    const rating = Math.round(item._id);
    if (rating >= 1 && rating <= 5) {
      starDistribution[rating].count = item.count;
    }
  });

  if (totalReviews > 0) {
    for (let r = 1; r <= 5; r++) {
      starDistribution[r].percentage = Math.round((starDistribution[r].count / totalReviews) * 100);
    }
  }

  // 3. Rating Trend Graph (Last 30 days breakdown)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const trendResult = await Testimonial.aggregate([
    {
      $match: {
        ...spaceFilter,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const trendTimeline = trendResult.map((t) => ({
    date: t._id,
    reviews: t.count,
    avgRating: Number(t.avgRating.toFixed(1)),
  }));

  res.status(200).json({
    success: true,
    analytics: {
      totalReviews,
      pendingReviews,
      approvedReviews,
      featuredReviews,
      averageRating,
      starDistribution,
      trendTimeline,
    },
  });
};
