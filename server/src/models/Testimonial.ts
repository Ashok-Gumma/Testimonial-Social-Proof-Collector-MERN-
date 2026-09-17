import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomAnswer {
  question: string;
  answer: string;
}

export type TestimonialStatus = 'pending' | 'approved' | 'rejected' | 'archived';

export interface ITestimonial extends Document {
  spaceId: Types.ObjectId;
  clientName: string;
  email: string;
  companyRole: string;
  avatar: string;
  rating: number;
  review: string;
  customAnswers: ICustomAnswer[];
  status: TestimonialStatus;
  featured: boolean;
  liked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customAnswerSchema = new Schema<ICustomAnswer>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const testimonialSchema = new Schema<ITestimonial>(
  {
    spaceId: { type: Schema.Types.ObjectId, ref: 'Space', required: true, index: true },
    clientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    companyRole: { type: String, default: '', trim: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
    customAnswers: { type: [customAnswerSchema], default: [] },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'archived'],
      default: 'pending',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    liked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound index for querying space testimonials by status and date
testimonialSchema.index({ spaceId: 1, status: 1, createdAt: -1 });

export const Testimonial = model<ITestimonial>('Testimonial', testimonialSchema);
