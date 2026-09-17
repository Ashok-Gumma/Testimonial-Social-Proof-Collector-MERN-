import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { Testimonial, Space } from '../../types';
import { MasonryGrid } from '../../components/widgets/MasonryGrid';
import { CarouselWidget } from '../../components/widgets/CarouselWidget';
import { StarRating } from '../../components/common/StarRating';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  LayoutGrid,
  SlidersHorizontal,
  Search,
  Star,
  Share2,
  Check,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';

export const WallOfLovePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme, toggleTheme } = useTheme();

  const [space, setSpace] = useState<Partial<Space> | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const { data } = await api.get(`/testimonials/public/${slug}`);
        if (data.success) {
          setSpace(data.space);
          setTestimonials(data.testimonials);
        } else {
          setError(data.message || 'Failed to load testimonials.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Space not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.companyRole && t.companyRole.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRating = selectedRating === 'all' || t.rating === selectedRating;

    return matchesSearch && matchesRating;
  });

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
      : '5.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white flex items-center justify-center p-4">
        <div className="text-center py-12">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading Wall of Love...</p>
        </div>
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Wall of Love Unavailable</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{error || 'Space not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white font-sans pb-20 selection:bg-blue-500/20 selection:text-blue-500 transition-colors duration-300">
      {/* Header Banner */}
      <header className="border-b border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-[#0d0d11]/60 backdrop-blur-2xl py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Top right theme toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 transition-all"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </button>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Official Wall of Love
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            {space.logo ? (
              <img
                src={space.logo}
                alt={space.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
                {space.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white">
            {space.name}
          </h1>

          <div className="flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <StarRating rating={Math.round(Number(avgRating))} readOnly size="sm" />
              <span className="font-bold text-slate-900 dark:text-white">{avgRating}</span>
            </div>
            <span>•</span>
            <span className="font-medium">
              {testimonials.length} Verified Reviews
            </span>
          </div>

          {/* Share Link Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              icon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            >
              {copied ? 'Link Copied to Clipboard!' : 'Share Wall of Love'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content & Controls */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Filter & View Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white/80 dark:bg-[#111115]/80 p-4 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl">
          {/* Search Input */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search reviews or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Star Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
            <button
              onClick={() => setSelectedRating('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedRating === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({testimonials.length})
            </button>
            {[5, 4, 3].map((r) => {
              const count = testimonials.filter((t) => t.rating === r).length;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRating(r)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 transition-all ${
                    selectedRating === r
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>({count})</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#1f1f26] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Masonry Grid Layout"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                viewMode === 'carousel'
                  ? 'bg-white dark:bg-[#1f1f26] text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Carousel Mode"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Render */}
        {viewMode === 'grid' ? (
          <MasonryGrid testimonials={filteredTestimonials} />
        ) : (
          <CarouselWidget testimonials={filteredTestimonials} />
        )}
      </main>
    </div>
  );
};
