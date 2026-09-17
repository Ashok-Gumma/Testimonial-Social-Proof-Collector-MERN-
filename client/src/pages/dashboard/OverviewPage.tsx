import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Space, Testimonial } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Layers,
  Star,
  Inbox,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Globe,
  ExternalLink,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [recentTestimonials, setRecentTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const handleSeedDemo = async () => {
    setSeedingDemo(true);
    try {
      const { data } = await api.post('/spaces/seed-demo');
      if (data.success) {
        await fetchOverviewData();
      }
    } catch (e: any) {
      console.error('Failed to seed demo spaces:', e);
      setError(e.response?.data?.message || 'Failed to seed demo spaces.');
    } finally {
      setSeedingDemo(false);
    }
  };


  const fetchOverviewData = async () => {
    setError(null);
    try {
      const { data: spacesRes } = await api.get('/spaces');
      if (spacesRes.success) {
        setSpaces(spacesRes.spaces || []);

        if (spacesRes.spaces && spacesRes.spaces.length > 0) {
          const firstSpaceId = spacesRes.spaces[0]._id;
          const { data: testRes } = await api.get(`/testimonials/space/${firstSpaceId}?limit=5`);
          if (testRes.success) {
            setRecentTestimonials(testRes.testimonials || []);
          }
        } else {
          setRecentTestimonials([]);
        }
      }
    } catch (e: any) {
      console.error('Overview fetch error:', e);
      setError(e.response?.data?.message || 'Failed to load dashboard spaces.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();

    const handleRefresh = () => {
      setLoading(true);
      fetchOverviewData();
    };

    window.addEventListener('refresh-dashboard', handleRefresh);
    return () => {
      window.removeEventListener('refresh-dashboard', handleRefresh);
    };
  }, []);

  const totalReviews = spaces.reduce((acc, s) => acc + (s.totalReviews || 0), 0);
  const pendingReviews = spaces.reduce((acc, s) => acc + (s.pendingReviews || 0), 0);
  const totalSpaces = spaces.length;

  const overallAvg =
    spaces.length > 0
      ? (spaces.reduce((acc, s) => acc + (s.avgRating || 5), 0) / spaces.length).toFixed(1)
      : '5.0';

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.patch(`/testimonials/${id}/status`, { status });
      fetchOverviewData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 selection:bg-blue-500/20 selection:text-blue-500">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Real-time analytics and customer reviews across your live MongoDB spaces.
          </p>
        </div>
        <Link to="/dashboard/spaces/new">
          <Button icon={<PlusCircle className="w-4 h-4" />} className="shadow-lg shadow-blue-500/20">
            Create Space
          </Button>
        </Link>
      </div>

      {/* Error Retry Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={fetchOverviewData}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Overview Apple Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard className="p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Reviews
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-3">
            {loading ? <Skeleton className="h-8 w-16" /> : totalReviews}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Across all active spaces</p>
        </GlassCard>

        <GlassCard className="p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Score
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-3 flex items-center gap-1.5">
            {loading ? <Skeleton className="h-8 w-16" /> : `${overallAvg} ★`}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Global customer satisfaction</p>
        </GlassCard>

        <GlassCard className="p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Inbox
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-500 mt-3">
            {loading ? <Skeleton className="h-8 w-16" /> : pendingReviews}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Awaiting your approval</p>
        </GlassCard>

        <GlassCard className="p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Spaces
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white mt-3">
            {loading ? <Skeleton className="h-8 w-16" /> : totalSpaces}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Live collection channels</p>
        </GlassCard>
      </div>

      {/* Spaces Quick Access */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            Your Branded Spaces
          </h2>
          <Link
            to="/dashboard/spaces"
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            Manage All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Skeleton className="h-48 w-full rounded-3xl" />
            <Skeleton className="h-48 w-full rounded-3xl" />
          </div>
        ) : spaces.length === 0 ? (
          <GlassCard className="p-10 text-center border border-slate-200/80 dark:border-white/10 rounded-3xl">
            {/* Notion cartoon empty state mascot */}
            <div className="w-24 h-24 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?seed=EmptySpace&backgroundColor=transparent"
                alt="Empty Spaces Mascot"
                className="w-20 h-20 object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No collection spaces yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mb-6 max-w-sm mx-auto">
              Create your first space to get a public link, collect testimonials from your customers, and showcase social proof.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/dashboard/spaces/new">
                <Button icon={<PlusCircle className="w-4 h-4" />}>Create First Space</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={handleSeedDemo}
                loading={seedingDemo}
                icon={<Sparkles className="w-4 h-4 text-blue-500" />}
              >
                Load Demo Spaces & Testimonials
              </Button>
            </div>

          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {spaces.map((space) => (
              <GlassCard key={space._id} className="p-6 border border-slate-200/80 dark:border-white/10 rounded-3xl flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {space.logo ? (
                        <img
                          src={space.logo}
                          alt={space.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shadow-sm"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
                          {space.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{space.name}</h3>
                        <span className="text-xs text-slate-400 font-mono">/submit/{space.slug}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-white/5 text-xs my-4 text-center">
                    <div>
                      <span className="text-slate-400 font-medium block">Total</span>
                      <span className="font-bold text-slate-900 dark:text-white">{space.totalReviews || 0}</span>
                    </div>
                    <div className="border-x border-slate-100 dark:border-white/5">
                      <span className="text-slate-400 font-medium block">Pending</span>
                      <span className="font-bold text-amber-500">{space.pendingReviews || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Rating</span>
                      <span className="font-bold text-emerald-500">{space.avgRating || 5.0} ★</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    to={`/dashboard/spaces/${space._id}/testimonials`}
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" className="w-full text-xs" icon={<Inbox className="w-3.5 h-3.5" />}>
                      Moderate
                    </Button>
                  </Link>
                  <a
                    href={`/submit/${space.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 transition-colors"
                    title="Open Public Collection Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Recent Moderation Activity Feed */}
      {recentTestimonials.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-4 h-4 text-blue-500" />
            Recent Moderation Queue
          </h2>

          <div className="space-y-3">
            {recentTestimonials.map((t) => (
              <GlassCard key={t._id} className="p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      t.avatar && !t.avatar.includes('ui-avatars.com')
                        ? t.avatar
                        : `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(t.clientName)}`
                    }
                    alt={t.clientName}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.clientName}</h4>
                      <Badge variant={t.status}>{t.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1 italic font-normal">
                      "{t.review}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StarRating rating={t.rating} readOnly size="sm" />
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => handleStatusChange(t._id, 'approved')}
                      className="p-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-colors"
                      title="Approve Testimonial"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(t._id, 'rejected')}
                      className="p-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
                      title="Reject Testimonial"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
