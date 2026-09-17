import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types';
import { StarRating } from '../common/StarRating';
import { GlassCard } from '../common/GlassCard';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselWidgetProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  theme?: 'dark' | 'light';
}

export const CarouselWidget: React.FC<CarouselWidgetProps> = ({
  testimonials,
  autoPlay = true,
  theme,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 font-medium text-sm">
        No testimonials available for carousel display.
      </div>
    );
  }

  const current = testimonials[currentIndex];
  const cartoonAvatar =
    current.avatar && !current.avatar.includes('ui-avatars.com')
      ? current.avatar
      : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
          current.clientName
        )}&backgroundColor=f3f4f6`;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={current._id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        >
          <GlassCard className="p-8 sm:p-10 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/30 relative">
            <Quote className="absolute top-6 right-8 w-10 h-10 text-slate-200 dark:text-white/10" />

            <div className="mb-4">
              <StarRating rating={current.rating} readOnly size="md" />
            </div>

            <p className="text-slate-800 dark:text-slate-200 text-lg md:text-xl font-normal leading-relaxed mb-8">
              "{current.review}"
            </p>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={cartoonAvatar}
                  alt={current.clientName}
                  className="w-12 h-12 rounded-2xl object-cover bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-0.5"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{current.clientName}</h4>
                  {current.companyRole && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{current.companyRole}</p>
                  )}
                </div>
              </div>

              {/* Counter Indicator */}
              <div className="text-xs font-semibold text-slate-400">
                {currentIndex + 1} / {testimonials.length}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#18181c] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-slate-300 dark:bg-white/20'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#18181c] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
