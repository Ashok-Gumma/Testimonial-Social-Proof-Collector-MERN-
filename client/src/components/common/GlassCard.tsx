import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } } : undefined}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={`apple-glass-card rounded-apple-lg p-6 relative overflow-hidden ${
        glow ? 'border-apple-blue/30 shadow-apple-glow' : ''
      } ${hoverEffect ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

