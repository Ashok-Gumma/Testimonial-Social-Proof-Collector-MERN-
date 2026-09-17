import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../../api/client';
import { Space } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { StarRating } from '../../components/common/StarRating';
import {
  User,
  Mail,
  Briefcase,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  Sparkles,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CollectTestimonialPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const [space, setSpace] = useState<Space | null>(null);
  const [loadingSpace, setLoadingSpace] = useState(true);
  const [spaceError, setSpaceError] = useState<string | null>(null);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState('');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [selectedCartoonSeed, setSelectedCartoonSeed] = useState<string>('Alex');
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const cartoonPresets = [
    { seed: 'Alex', name: 'Alex' },
    { seed: 'Sarah', name: 'Sarah' },
    { seed: 'Marcus', name: 'Marcus' },
    { seed: 'Elena', name: 'Elena' },
    { seed: 'David', name: 'David' },
    { seed: 'Zoe', name: 'Zoe' },
  ];

  useEffect(() => {
    const fetchSpace = async () => {
      if (!slug) return;
      try {
        const { data } = await api.get(`/spaces/public/${slug}`);
        if (data.success) {
          setSpace(data.space);
        } else {
          setSpaceError(data.message || 'Space not found.');
        }
      } catch (err: any) {
        setSpaceError(err.response?.data?.message || 'Invalid or non-existent space slug.');
      } finally {
        setLoadingSpace(false);
      }
    };

    fetchSpace();
  }, [slug]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCustomAnswerChange = (question: string, val: string) => {
    setCustomAnswers((prev) => ({ ...prev, [question]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!clientName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!review.trim() || review.trim().length < 5) {
      setFormError('Please enter a testimonial review of at least 5 characters.');
      return;
    }

    if (space?.requireAvatar && !avatarFile && !avatarPreview && !selectedCartoonSeed) {
      setFormError('An avatar photo or cartoon persona is required by this space.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('spaceSlug', slug || '');
      formData.append('clientName', clientName);
      formData.append('email', email);
      formData.append('companyRole', companyRole);
      formData.append('rating', rating.toString());
      formData.append('review', review);

      const customAnswersArr = Object.entries(customAnswers).map(([question, answer]) => ({
        question,
        answer,
      }));
      formData.append('customAnswers', JSON.stringify(customAnswersArr));

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else {
        const cartoonUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
          selectedCartoonSeed || clientName
        )}&backgroundColor=e0e7ff,ecfdf5,fef3c7`;
        formData.append('avatar', cartoonUrl);
      }

      const { data } = await api.post('/testimonials/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        setSubmitted(true);
        // Apple-style celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0071e3', '#34c759', '#ff9500', '#af52de'],
        });
      } else {
        setFormError(data.message || 'Submission failed.');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error submitting testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSpace) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white flex items-center justify-center p-6">
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading collection studio...</p>
        </div>
      </div>
    );
  }

  if (spaceError || !space) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white flex items-center justify-center p-6">
        <GlassCard className="max-w-md w-full p-8 text-center border border-rose-500/20 rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4 text-rose-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Space Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {spaceError || 'The requested feedback space does not exist.'}
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white font-sans py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative selection:bg-blue-500/20 selection:text-blue-500 transition-colors duration-300">
      {/* Apple ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-600/15 dark:via-purple-600/10 dark:to-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <GlassCard className="p-8 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/40 rounded-3xl backdrop-blur-2xl">
          {/* Top Brand Header */}
          <div className="text-center mb-8">
            {space.logo ? (
              <img
                src={space.logo}
                alt={space.name}
                className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 border border-slate-200 dark:border-white/10 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg font-bold text-2xl">
                {space.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {space.name}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-4 py-2 rounded-xl inline-block">
              {space.prompt}
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="relative w-28 h-28 mx-auto mb-5">
                <div className="w-28 h-28 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=JoyCelebration&backgroundColor=transparent"
                    alt="Thank You"
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#111115]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Received
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Thank You! 🎉
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto mb-8 font-normal">
                Your testimonial has been submitted successfully for moderation. We deeply appreciate you sharing your experience with {space.name}!
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setSubmitted(false);
                  setReview('');
                  setRating(5);
                  setClientName('');
                  setEmail('');
                  setCompanyRole('');
                  setAvatarFile(null);
                  setAvatarPreview('');
                  setCustomAnswers({});
                }}
              >
                Submit Another Response
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Star Rating */}
              {space.enableRating && (
                <div className="space-y-2 text-center bg-slate-50 dark:bg-white/[0.03] p-5 rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Overall Experience
                  </label>
                  <div className="flex justify-center pt-1">
                    <StarRating rating={rating} onChange={setRating} size="lg" />
                  </div>
                </div>
              )}

              {/* Review Text */}
              <Textarea
                label="Your Review / Testimonial *"
                placeholder="Share what you loved about using our product..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                required
              />

              {/* Custom Questions if configured */}
              {space.customQuestions && space.customQuestions.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-white/10">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Quick Questions
                  </p>
                  {space.customQuestions.map((q, idx) => (
                    <Input
                      key={idx}
                      label={q}
                      placeholder="Your answer..."
                      value={customAnswers[q] || ''}
                      onChange={(e) => handleCustomAnswerChange(q, e.target.value)}
                    />
                  ))}
                </div>
              )}

              {/* Customer Details */}
              <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Your Details
                </p>

                <Input
                  label="Your Full Name *"
                  placeholder="e.g. Sarah Jenkins"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  icon={<User className="w-4 h-4" />}
                />

                <Input
                  label="Your Email Address *"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="Job Title & Company (Optional)"
                  placeholder="e.g. Head of Growth @ Stripe"
                  value={companyRole}
                  onChange={(e) => setCompanyRole(e.target.value)}
                  icon={<Briefcase className="w-4 h-4" />}
                />

                {/* Avatar Selection: Cartoon Avatar Presets or File Upload */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Choose Cartoon Persona or Upload Photo
                  </label>

                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {cartoonPresets.map((p) => {
                      const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${p.seed}&backgroundColor=f3f4f6`;
                      const isSelected = !avatarFile && selectedCartoonSeed === p.seed;

                      return (
                        <button
                          key={p.seed}
                          type="button"
                          onClick={() => {
                            setSelectedCartoonSeed(p.seed);
                            setAvatarFile(null);
                            setAvatarPreview('');
                          }}
                          className={`relative p-1 rounded-2xl border transition-all ${
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-500/10'
                              : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                          }`}
                        >
                          <img src={url} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}

                    <label
                      className={`cursor-pointer flex items-center justify-center w-12 h-12 rounded-2xl border transition-all shrink-0 ${
                        avatarFile
                          ? 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-500/10'
                          : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                      title="Upload Custom Photo"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Preview" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <Upload className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                loading={submitting}
                className="w-full mt-6 shadow-xl shadow-blue-500/20"
                icon={<Heart className="w-4 h-4 fill-white" />}
              >
                Send Testimonial
              </Button>
            </form>
          )}
        </GlassCard>

        {/* Footer Credit */}
        <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Powered by <span className="font-bold text-slate-800 dark:text-slate-200">ProofPulse</span> — Social Proof Platform
        </div>
      </div>
    </div>
  );
};
