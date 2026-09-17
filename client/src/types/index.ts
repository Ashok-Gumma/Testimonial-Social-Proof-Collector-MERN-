export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  _id: string;
  ownerId: string;
  name: string;
  slug: string;
  logo?: string;
  headerTitle?: string;
  prompt: string;
  requireAvatar: boolean;
  enableRating: boolean;
  customQuestions: string[];
  accentColor: string;
  totalReviews?: number;
  approvedReviews?: number;
  pendingReviews?: number;
  avgRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomAnswer {
  question: string;
  answer: string;
}

export type TestimonialStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface Testimonial {
  _id: string;
  spaceId: string;
  clientName: string;
  email: string;
  companyRole?: string;
  avatar?: string;
  rating: number;
  review: string;
  customAnswers: CustomAnswer[];
  status: TestimonialStatus;
  featured: boolean;
  liked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StarDistribution {
  count: number;
  percentage: number;
}

export interface TrendTimelineItem {
  date: string;
  reviews: number;
  avgRating: number;
}

export interface AnalyticsData {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  featuredReviews: number;
  averageRating: number;
  starDistribution: Record<number, StarDistribution>;
  trendTimeline: TrendTimelineItem[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  [key: string]: any;
}
