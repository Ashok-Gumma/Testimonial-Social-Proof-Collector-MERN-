import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { Space, Testimonial } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { MasonryGrid } from '../../components/widgets/MasonryGrid';
import { CarouselWidget } from '../../components/widgets/CarouselWidget';
import { BadgeWidget } from '../../components/widgets/BadgeWidget';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Code,
  Copy,
  Check,
  LayoutGrid,
  SlidersHorizontal,
  Award,
  ArrowLeft,
  Eye,
} from 'lucide-react';

export const EmbedGeneratorPage: React.FC = () => {
  const { id: spaceId } = useParams<{ id: string }>();

  const [space, setSpace] = useState<Space | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Widget Builder Settings
  const [widgetType, setWidgetType] = useState<'grid' | 'carousel' | 'badge'>('grid');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [cardLimit, setCardLimit] = useState<number>(20);

  // Copy Snippet States
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  useEffect(() => {
    const fetchEmbedData = async () => {
      if (!spaceId) return;
      try {
        const { data: spaceRes } = await api.get(`/spaces/${spaceId}`);
        if (spaceRes.success) setSpace(spaceRes.space);

        const { data: testRes } = await api.get(`/testimonials/public/${spaceRes.space.slug}?limit=${cardLimit}`);
        if (testRes.success) setTestimonials(testRes.testimonials);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedData();
  }, [spaceId, cardLimit]);

  const slug = space?.slug || 'your-space';
  const baseUrl = window.location.origin;

  // Generated Snippets
  const scriptSnippet = `<!-- ProofPulse Testimonial Widget -->
<div id="proofpulse-widget" data-space="${slug}" data-type="${widgetType}" data-theme="${theme}"></div>
<script src="${baseUrl}/widgets/embed.js" async defer></script>`;

  const iframeSnippet = `<iframe
  src="${baseUrl}/embed/${slug}/${widgetType}?theme=${theme}&limit=${cardLimit}"
  width="100%"
  height="${widgetType === 'badge' ? '80' : widgetType === 'carousel' ? '320' : '600'}"
  frameborder="0"
  scrolling="no"
  style="border:none; overflow:hidden;"
></iframe>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopyIframe = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-200/85 pb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Space
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-900 text-white">
            <Code className="w-5 h-5" />
          </div>
          Embed Generator {space ? `— ${space.name}` : ''}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Customize and generate copy-paste HTML or Iframe embed code snippets for your website.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Configuration Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6 space-y-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              1. Choose Widget Style
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setWidgetType('grid')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  widgetType === 'grid'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm font-bold'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-xs">Masonry Grid</span>
              </button>

              <button
                onClick={() => setWidgetType('carousel')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  widgetType === 'carousel'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm font-bold'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="text-xs">Carousel</span>
              </button>

              <button
                onClick={() => setWidgetType('badge')}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                  widgetType === 'badge'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm font-bold'
                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Award className="w-5 h-5" />
                <span className="text-xs">Badge</span>
              </button>
            </div>

            {/* Customize Settings */}
            <div className="space-y-4 pt-4 border-t border-neutral-200/80">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                2. Customize Options
              </h3>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Widget Theme Mode
                </label>
                <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-full border border-neutral-200">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      theme === 'light' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'
                    }`}
                  >
                    Clean White
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      theme === 'dark' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500'
                    }`}
                  >
                    Apple Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Max Cards Displayed
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={cardLimit}
                  onChange={(e) => setCardLimit(Number(e.target.value))}
                  className="w-full notion-input rounded-xl px-4 py-2 text-xs text-neutral-900 bg-neutral-50 border border-neutral-200 focus:bg-white"
                />
              </div>
            </div>

            {/* Copy Snippets */}
            <div className="space-y-4 pt-4 border-t border-neutral-200/80">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                3. Copy Code Snippet
              </h3>

              {/* JS Script Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>HTML + JS Script Tag (Recommended)</span>
                  <button
                    onClick={handleCopyScript}
                    className="text-neutral-900 hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy JS
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-900 text-neutral-200 rounded-2xl text-[11px] font-mono overflow-x-auto border border-neutral-800">
                  {scriptSnippet}
                </pre>
              </div>

              {/* Iframe Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>Iframe Embed Snippet</span>
                  <button
                    onClick={handleCopyIframe}
                    className="text-neutral-900 hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    {copiedIframe ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Iframe
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 bg-neutral-900 text-neutral-200 rounded-2xl text-[11px] font-mono overflow-x-auto border border-neutral-800">
                  {iframeSnippet}
                </pre>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Live Interactive Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-neutral-900" /> Live Interactive Preview
            </h3>
            <span className="text-xs text-neutral-500 font-mono">
              Mode: {theme.toUpperCase()} • Type: {widgetType.toUpperCase()}
            </span>
          </div>

          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all min-h-[500px] flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-neutral-950 border-neutral-800'
                : 'bg-neutral-50 border-neutral-200/80 shadow-sm'
            }`}
          >
            {testimonials.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                No approved testimonials yet to preview.
              </div>
            ) : widgetType === 'grid' ? (
              <MasonryGrid testimonials={testimonials} theme={theme} />
            ) : widgetType === 'carousel' ? (
              <CarouselWidget testimonials={testimonials} theme={theme} />
            ) : (
              <BadgeWidget space={space} testimonials={testimonials} theme={theme} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

