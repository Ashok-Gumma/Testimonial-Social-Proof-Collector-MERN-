import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import { Testimonial, Space } from '../../types';
import { MasonryGrid } from '../../components/widgets/MasonryGrid';
import { CarouselWidget } from '../../components/widgets/CarouselWidget';
import { BadgeWidget } from '../../components/widgets/BadgeWidget';
import { Loader2 } from 'lucide-react';

export const EmbedWidgetPage: React.FC = () => {
  const { slug, type } = useParams<{ slug: string; type: string }>();
  const [searchParams] = useSearchParams();

  const themeParam = searchParams.get('theme') || 'light';
  const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

  const [space, setSpace] = useState<Partial<Space> | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmbedData = async () => {
      if (!slug) return;
      try {
        const { data } = await api.get(`/testimonials/public/${slug}?limit=${limit}`);
        if (data.success) {
          setSpace(data.space);
          setTestimonials(data.testimonials);
        }
      } catch (e) {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedData();
  }, [slug, limit]);

  if (loading) {
    return (
      <div className="min-h-[160px] flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const isDark = themeParam === 'dark';

  return (
    <div className={`w-full min-h-screen p-4 font-sans ${isDark ? 'dark bg-[#08080a] text-white' : 'bg-[#fbfbfd] text-slate-900'}`}>
      {type === 'carousel' ? (
        <CarouselWidget testimonials={testimonials} theme={themeParam as 'dark' | 'light'} />
      ) : type === 'badge' ? (
        <BadgeWidget testimonials={testimonials} spaceName={space?.name} theme={themeParam as 'dark' | 'light'} />
      ) : (
        <MasonryGrid testimonials={testimonials} theme={themeParam as 'dark' | 'light'} />
      )}
    </div>
  );
};
