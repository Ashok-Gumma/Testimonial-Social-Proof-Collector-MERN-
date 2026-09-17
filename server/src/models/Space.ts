import { Schema, model, Document, Types } from 'mongoose';

export interface ISpace extends Document {
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  logo: string;
  headerTitle: string;
  prompt: string;
  requireAvatar: boolean;
  enableRating: boolean;
  customQuestions: string[];
  accentColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const spaceSchema = new Schema<ISpace>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    logo: { type: String, default: '' },
    headerTitle: { type: String, default: 'Header Title' },
    prompt: { type: String, default: 'Could you please take 60 seconds to share your experience with us?' },
    requireAvatar: { type: Boolean, default: false },
    enableRating: { type: Boolean, default: true },
    customQuestions: { type: [String], default: [] },
    accentColor: { type: String, default: '#6366f1' },
  },
  { timestamps: true }
);

export const Space = model<ISpace>('Space', spaceSchema);
