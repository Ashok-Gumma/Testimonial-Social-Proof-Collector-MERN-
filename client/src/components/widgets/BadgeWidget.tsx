import React from 'react';
import { Testimonial } from '../../types';
import { Star } from 'lucide-react';
import { Space } from '../../types';

interface BadgeWidgetProps {
  testimonials: Testimonial[];
  spaceName?: string;
  space?: Space | null;
  theme?: 'dark' | 'light';
}

export const BadgeWidget: React.FC<BadgeWidgetProps> = ({
  testimonials,
  theme = 'light',
}) => {
  const count = testimonials.length;
  const avgRating =
    count > 0
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / count).toFixed(1)
      : '5.0';

  const avatarStack = testimonials
    .slice(0, 4)
    .map((t) =>
      t.avatar && !t.avatar.includes('ui-avatars.com')
        ? t.avatar
        : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
            t.clientName
          )}&backgroundColor=f3f4f6`
    );

  const isDark = theme === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-3.5 px-4 py-2 rounded-full border transition-all cursor-pointer shadow-lg hover:scale-105 backdrop-blur-xl ${
        isDark
          ? 'bg-[#111115]/90 border-white/10 text-white shadow-black/40'
          : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-black/5'
      }`}
    >
      {/* Avatar Stack */}
      <div className="flex -space-x-2 overflow-hidden">
        {avatarStack.map((url, i) => (
          <img
            key={i}
            src={url}
            alt="Client"
            className={`inline-block h-8 w-8 rounded-full ring-2 object-cover p-0.5 ${
              isDark ? 'ring-[#111115] bg-[#18181c]' : 'ring-white bg-slate-100'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <div className="flex items-center text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
          <span className={`text-xs font-bold ml-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {avgRating}
          </span>
        </div>
        <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Loved by {count}+ verified users
        </span>
      </div>
    </div>
  );
};
