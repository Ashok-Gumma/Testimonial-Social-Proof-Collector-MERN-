import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  readOnly = false,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeScore = hoverRating || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= activeScore;

        return (
          <motion.button
            key={star}
            type="button"
            disabled={readOnly}
            whileHover={!readOnly ? { scale: 1.25 } : undefined}
            whileTap={!readOnly ? { scale: 0.9 } : undefined}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            className={`transition-all duration-150 ${
              readOnly ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <Star
              className={`${starSizes[size]} transition-all duration-200 ${
                isFilled
                  ? 'fill-[#ffb800] text-[#ffb800] drop-shadow-[0_0_8px_rgba(255,184,0,0.35)]'
                  : 'fill-neutral-200/80 text-neutral-300 dark:fill-white/[0.06] dark:text-white/20'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

