import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { AnalyticsData, Space } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Skeleton } from '../../components/common/Skeleton';
import {
  BarChart3,
  Star,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { id: spaceId } = useParams<{ id: string }>();

  const [space, setSpace] = useState<Space | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!spaceId) return;
      try {
        // Fetch space metadata
        const { data: spaceRes } = await api.get(`/spaces/${spaceId}`);
        if (spaceRes.success) setSpace(spaceRes.space);

        // Fetch space analytics
        const { data: analyticsRes } = await api.get(`/analytics/space/${spaceId}`);
        if (analyticsRes.success) {
          setAnalytics(analyticsRes.analytics);
        }
      } catch (e) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [spaceId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-200/80 pb-6">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-900 text-white">
            <BarChart3 className="w-5 h-5" />
          </div>
          Analytics & Insights {space ? `— ${space.name}` : ''}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Detailed metrics, star breakdown, and performance trends for customer feedback.
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Average Rating
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 mt-3 flex items-center gap-2">
            {analytics?.averageRating || 5.0} ★
          </div>
          <p className="text-xs text-neutral-400 mt-1">Based on approved reviews</p>
        </GlassCard>

        <GlassCard className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Total Submissions
            </span>
            <div className="p-2 rounded-xl bg-neutral-100 text-neutral-900">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-neutral-900 mt-3">
            {analytics?.totalReviews || 0}
          </div>
          <p className="text-xs text-neutral-400 mt-1">All-time collected feedback</p>
        </GlassCard>

        <GlassCard className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Approved Live
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-3">
            {analytics?.approvedReviews || 0}
          </div>
          <p className="text-xs text-neutral-400 mt-1">Visible on Wall & Embeds</p>
        </GlassCard>

        <GlassCard className="p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Featured Reviews
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-700 mt-3">
            {analytics?.featuredReviews || 0}
          </div>
          <p className="text-xs text-neutral-400 mt-1">Highlighted testimonials</p>
        </GlassCard>
      </div>

      {/* Star Distribution Breakdown */}
      <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" /> Star Rating Distribution
        </h3>

        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((star) => {
            const data = analytics?.starDistribution[star] || { count: 0, percentage: 0 };

            return (
              <div key={star} className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1 w-16 text-neutral-700">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                {/* Progress Bar */}
                <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/60">
                  <div
                    className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>

                <div className="w-20 text-right text-neutral-500">
                  <span>{data.count} ({data.percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 30-Day Rating Trend Timeline Chart */}
      <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-neutral-900" /> 30-Day Feedback Volume Trend
        </h3>

        {analytics?.trendTimeline && analytics.trendTimeline.length > 0 ? (
          <div className="h-64 flex items-end justify-between gap-2 pt-8 px-2 border-b border-neutral-200">
            {analytics.trendTimeline.map((item, idx) => {
              const maxCount = Math.max(...analytics.trendTimeline.map((t) => t.reviews), 1);
              const heightPct = Math.max((item.reviews / maxCount) * 100, 15);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-lg pointer-events-none z-10 whitespace-nowrap font-medium">
                    {item.date}: {item.reviews} reviews ({item.avgRating} ★)
                  </div>

                  <div
                    className="w-full bg-neutral-900 rounded-t-lg transition-all duration-300 group-hover:bg-neutral-700"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-400 text-xs">
            No feedback timeline data recorded yet.
          </div>
        )}
      </GlassCard>
    </div>
  );
};
