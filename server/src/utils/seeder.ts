import { Types } from 'mongoose';
import { User } from '../models/User';
import { Space } from '../models/Space';
import { Testimonial } from '../models/Testimonial';

/**
 * Seeds curated demo spaces and testimonials for a specific user ID.
 */
export const seedDemoForUser = async (userId: string | Types.ObjectId): Promise<{ spacesCreated: number; testimonialsCreated: number }> => {
  const targetUserId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

  // 1. Check existing spaces for this user
  const userSpaces = await Space.find({ ownerId: targetUserId });
  const existingSlugs = userSpaces.map((s) => s.slug);

  let spacesCreated = 0;
  let testimonialsCreated = 0;

  // Helper to ensure a globally unique slug
  const getUniqueSlug = async (baseSlug: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;
    while (await Space.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  };

  // Demo Space 1: Acme SaaS Platform
  let space1 = userSpaces.find((s) => s.slug.startsWith('acme-saas'));
  if (!space1) {
    const slug1 = await getUniqueSlug('acme-saas');
    space1 = await Space.create({
      ownerId: targetUserId,
      name: 'Acme SaaS Platform',
      slug: slug1,
      headerTitle: 'Header Title',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      prompt: 'Would you mind spending 60 seconds sharing how Acme SaaS helped streamline your team workflow?',
      requireAvatar: true,
      enableRating: true,
      accentColor: '#6366f1',
      customQuestions: [
        'What is the #1 feature you use daily?',
        'How much time do you save per week using Acme?',
      ],
    });
    spacesCreated++;
  }

  // Demo Space 2: Linear Craft Studio
  let space2 = userSpaces.find((s) => s.slug.startsWith('linear-craft'));
  if (!space2) {
    const slug2 = await getUniqueSlug('linear-craft');
    space2 = await Space.create({
      ownerId: targetUserId,
      name: 'Linear Craft Studio',
      slug: slug2,
      headerTitle: 'Header Title',
      logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
      prompt: 'Tell us how Linear Craft transformed your design handoff process!',
      requireAvatar: false,
      enableRating: true,
      accentColor: '#ec4899',
      customQuestions: [
        'What made you choose us over alternative agencies?',
      ],
    });
    spacesCreated++;
  }

  // Seed testimonials for Space 1 if empty or low
  const space1TestimonialsCount = await Testimonial.countDocuments({ spaceId: space1._id });
  if (space1TestimonialsCount === 0) {
    const space1Testimonials = [
      {
        spaceId: space1._id,
        clientName: 'Sarah Jenkins',
        email: 'sarah.j@stripe.com',
        companyRole: 'Head of Product @ Stripe',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        review: 'Acme SaaS cut our customer onboarding cycle by 40%. The UI is lightning fast and our entire team fell in love with it on day one.',
        customAnswers: [
          { question: 'What is the #1 feature you use daily?', answer: 'Automated workflow pipelines' },
          { question: 'How much time do you save per week using Acme?', answer: 'Around 12 hours every week' },
        ],
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Marcus Chen',
        email: 'marcus@linear.app',
        companyRole: 'Engineering Lead @ Linear',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        review: 'The social proof widgets converted 24% more free trial users into paid subscribers within 14 days of embedding on our pricing page.',
        customAnswers: [
          { question: 'What is the #1 feature you use daily?', answer: 'Embeddable Wall of Love' },
          { question: 'How much time do you save per week using Acme?', answer: 'Saved over 20 developer hours building custom widgets' },
        ],
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Elena Rostova',
        email: 'elena@vercel.com',
        companyRole: 'VP of Marketing @ Vercel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        review: 'Hands down the best testimonial collector on the market. Setup took 3 minutes and customer responses started rolling in right away.',
        customAnswers: [
          { question: 'What is the #1 feature you use daily?', answer: 'Instant Moderation Inbox' },
        ],
        status: 'approved',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'David Kalu',
        email: 'david@figma.com',
        companyRole: 'Design Director @ Figma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 4,
        review: 'Super clean developer experience and gorgeous glassmorphism aesthetics. Our conversion rate increased significantly!',
        customAnswers: [],
        status: 'pending',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space1._id,
        clientName: 'Jessica Taylor',
        email: 'jessica@notion.so',
        companyRole: 'Community Manager @ Notion',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        review: 'Collecting testimonials used to be a pain over email. Now we just send clients our custom link and get video/text social proof instantly.',
        customAnswers: [],
        status: 'pending',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
    ];
    await Testimonial.insertMany(space1Testimonials);
    testimonialsCreated += space1Testimonials.length;
  }

  // Seed testimonials for Space 2 if empty or low
  const space2TestimonialsCount = await Testimonial.countDocuments({ spaceId: space2._id });
  if (space2TestimonialsCount === 0) {
    const space2Testimonials = [
      {
        spaceId: space2._id,
        clientName: 'Brian Cox',
        email: 'brian@framer.com',
        companyRole: 'Founder @ DesignLabs',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        review: 'Linear Craft transformed our product branding. Highly recommended team with impeccable craft and responsiveness!',
        customAnswers: [
          { question: 'What made you choose us over alternative agencies?', answer: 'Uncompromising attention to typography and motion design.' },
        ],
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space2._id,
        clientName: 'Maya Patel',
        email: 'maya@monolith.tech',
        companyRole: 'Product VP @ Monolith',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        review: 'The design handoff workflow was seamless. ProofPulse Wall of Love lets our stakeholders see client reactions live.',
        customAnswers: [],
        status: 'approved',
        featured: true,
        liked: true,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        spaceId: space2._id,
        clientName: 'Lucas Dubois',
        email: 'lucas@craft.paris',
        companyRole: 'Creative Director @ Studio Paris',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        rating: 4,
        review: 'Phenomenal work on the brand launch! The custom feedback questions provided invaluable insights.',
        customAnswers: [],
        status: 'pending',
        featured: false,
        liked: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];
    await Testimonial.insertMany(space2Testimonials);
    testimonialsCreated += space2Testimonials.length;
  }

  return { spacesCreated, testimonialsCreated };
};

/**
 * Standalone seeder invoked on database initialization if needed.
 * Attaches demo spaces/testimonials to the first user found in the system if any,
 * without creating any dummy demo user accounts.
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    const firstUser = await User.findOne().sort({ createdAt: 1 });
    if (!firstUser) {
      console.log('ℹ️ No registered users yet. Skipping initial demo spaces seeding.');
      return;
    }

    const spaceCount = await Space.countDocuments({ ownerId: firstUser._id });
    if (spaceCount > 0) {
      console.log(`ℹ️ User ${firstUser.email} already has spaces. Skipping demo seeding.`);
      return;
    }

    console.log(`🌱 Seeding demo spaces and testimonials for user ${firstUser.email}...`);
    const result = await seedDemoForUser(firstUser._id as any);
    console.log(`✅ Seeded ${result.spacesCreated} spaces and ${result.testimonialsCreated} testimonials for ${firstUser.email}.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
