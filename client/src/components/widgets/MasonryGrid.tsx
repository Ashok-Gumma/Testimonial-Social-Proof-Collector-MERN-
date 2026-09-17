import React from 'react';
import { Testimonial } from '../../types';
import { StarRating } from '../common/StarRating';
import { GlassCard } from '../common/GlassCard';
import { Heart, Sparkles, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface MasonryGridProps {
  testimonials: Testimonial[];
  accentColor?: string;
  theme?: 'dark' | 'light';
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  testimonials,
  theme,
}) => {
  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Quote className="w-8 h-8" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          No approved testimonials found.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {testimonials.map((t, idx) => {
        const cartoonAvatar =
          t.avatar && !t.avatar.includes('ui-avatars.com')
            ? t.avatar
            : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
                t.clientName
              )}&backgroundColor=f3f4f6`;

        return (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="break-inside-avoid"
          >
            <GlassCard
              className={`relative group p-6 border transition-all duration-300 rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/30 ${
                t.featured
                  ? 'border-amber-400/40 bg-amber-500/[0.04] dark:bg-amber-500/[0.06]'
                  : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              {/* Featured Badge */}
              {t.featured && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Featured
                </div>
              )}

              {/* Rating Stars */}
              <div className="mb-3.5">
                <StarRating rating={t.rating} readOnly size="sm" />
              </div>

              {/* Review text */}
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 font-normal">
                "{t.review}"
              </p>

              {/* Custom Answers if any */}
              {t.customAnswers && t.customAnswers.length > 0 && (
                <div className="mb-6 pt-3 border-t border-slate-100 dark:border-white/5 space-y-2">
                  {t.customAnswers.map((ans, aIdx) => (
                    <div key={aIdx} className="text-xs">
                      <span className="text-slate-400 font-medium block">{ans.question}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">{ans.answer}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* User Profile Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <img
                    src={cartoonAvatar}
                    alt={t.clientName}
                    className="w-10 h-10 rounded-2xl object-cover bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-0.5"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.clientName}</h4>
                    {t.companyRole && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.companyRole}</p>
                    )}
                  </div>
                </div>

                {t.liked && (
                  <div className="text-rose-500 p-1.5 bg-rose-500/10 rounded-full">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};
