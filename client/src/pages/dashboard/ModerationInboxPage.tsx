import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/client';
import { Testimonial, TestimonialStatus, Space } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StarRating } from '../../components/common/StarRating';
import { Input } from '../../components/common/Input';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Inbox,
  Search,
  CheckCircle2,
  XCircle,
  Archive,
  Star,
  Heart,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
  ArrowLeft,
  Globe,
} from 'lucide-react';

export const ModerationInboxPage: React.FC = () => {
  const { id: spaceId } = useParams<{ id: string }>();

  const [space, setSpace] = useState<Space | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    archived: 0,
  });

  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('newest');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const fetchTestimonials = async () => {
    if (!spaceId) return;
    try {
      // Fetch space details first
      const { data: spaceData } = await api.get(`/spaces/${spaceId}`);
      if (spaceData.success) {
        setSpace(spaceData.space);
      }

      // Build query string
      let url = `/testimonials/space/${spaceId}?status=${currentTab}&rating=${selectedRating}&sort=${sortOption}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

      const { data } = await api.get(url);
      if (data.success) {
        setTestimonials(data.testimonials);
        setStatusCounts(data.counts || statusCounts);
      }
    } catch (err: any) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [spaceId, currentTab, selectedRating, sortOption]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTestimonials();
  };

  const handleStatusUpdate = async (id: string, newStatus: TestimonialStatus) => {
    try {
      const { data } = await api.patch(`/testimonials/${id}/status`, { status: newStatus });
      if (data.success) {
        fetchTestimonials();
      }
    } catch (e) {}
  };

  const handleToggleFeature = async (id: string) => {
    try {
      const { data } = await api.patch(`/testimonials/${id}/feature`);
      if (data.success) {
        fetchTestimonials();
      }
    } catch (e) {}
  };

  const handleToggleLike = async (id: string) => {
    try {
      const { data } = await api.patch(`/testimonials/${id}/like`);
      if (data.success) {
        fetchTestimonials();
      }
    } catch (e) {}
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await api.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (e) {}
  };

  // Multi-select helpers
  const toggleSelectAll = () => {
    if (selectedIds.length === testimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(testimonials.map((t) => t._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'archive' | 'delete') => {
    if (selectedIds.length === 0) return;
    setBulkProcessing(true);

    try {
      const { data } = await api.post('/testimonials/bulk', {
        ids: selectedIds,
        action,
      });

      if (data.success) {
        setSelectedIds([]);
        fetchTestimonials();
      }
    } catch (e) {
    } finally {
      setBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
        <div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <Inbox className="w-5 h-5" />
            </div>
            Moderation Inbox {space ? `— ${space.name}` : ''}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review, approve, feature, or archive customer feedback in real-time.
          </p>
        </div>

        {space && (
          <div className="flex items-center gap-2">
            <a
              href={`/submit/${space.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 rounded-full border border-neutral-200/80 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              Submit Form ↗
            </a>
            <a
              href={`/wall/${space.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white rounded-full transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Wall of Love ↗
            </a>
          </div>
        )}
      </div>

      {/* Inbox Status Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 overflow-x-auto pb-3">
        {[
          { key: 'all', label: 'All Reviews' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
          { key: 'archived', label: 'Archived' },
        ].map((tab) => {
          const isActive = currentTab === tab.key;
          const count = statusCounts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setCurrentTab(tab.key);
                setSelectedIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-200/80 text-neutral-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50/80 p-4 rounded-2xl border border-neutral-200/80">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
          <Input
            placeholder="Search by name, email, feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-neutral-400" />}
          />
        </form>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Rating filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="notion-input rounded-xl px-3 py-2 text-xs text-neutral-800 bg-white font-medium focus:outline-none border border-neutral-200"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
          </select>

          {/* Sort Option */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="notion-input rounded-xl px-3 py-2 text-xs text-neutral-800 bg-white font-medium focus:outline-none border border-neutral-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-desc">Highest Rating</option>
            <option value="rating-asc">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Bulk Operations Action Bar */}
      {testimonials.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white rounded-2xl shadow-sm text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 font-semibold text-neutral-200 hover:text-white"
            >
              {selectedIds.length === testimonials.length && testimonials.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-neutral-500" />
              )}
              Select All ({selectedIds.length}/{testimonials.length})
            </button>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                loading={bulkProcessing}
                onClick={() => handleBulkAction('approve')}
                className="bg-emerald-500 text-white hover:bg-emerald-600 text-[11px] border-none"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Approve
              </Button>
              <Button
                variant="secondary"
                size="sm"
                loading={bulkProcessing}
                onClick={() => handleBulkAction('archive')}
                className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-[11px]"
                icon={<Archive className="w-3.5 h-3.5" />}
              >
                Archive
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={bulkProcessing}
                onClick={() => handleBulkAction('delete')}
                className="text-[11px]"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Testimonials List */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : testimonials.length === 0 ? (
        <GlassCard className="p-12 text-center bg-white border border-neutral-200/80 rounded-3xl">
          <Inbox className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-900">No testimonials found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            There are no testimonials matching the selected filter criteria.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => {
            const isSelected = selectedIds.includes(t._id);
            const fallbackAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
              t.clientName || 'user'
            )}`;

            return (
              <GlassCard
                key={t._id}
                className={`p-6 transition-all border rounded-3xl bg-white ${
                  isSelected
                    ? 'border-neutral-900 ring-2 ring-neutral-900/10 shadow-md'
                    : 'border-neutral-200/80 hover:border-neutral-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Select & User Info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleSelectOne(t._id)}
                      className="mt-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-neutral-900" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-300" />
                      )}
                    </button>

                    <img
                      src={t.avatar || fallbackAvatar}
                      alt={t.clientName}
                      className="w-12 h-12 rounded-full object-cover bg-neutral-100 border border-neutral-200 shrink-0"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-neutral-900 text-base">{t.clientName}</h4>
                        <span className="text-xs text-neutral-400 font-mono">({t.email})</span>
                        <Badge variant={t.status}>{t.status}</Badge>

                        {t.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                          </span>
                        )}
                      </div>

                      {t.companyRole && (
                        <p className="text-xs text-neutral-500 font-medium">{t.companyRole}</p>
                      )}

                      <div className="py-0.5">
                        <StarRating rating={t.rating} readOnly size="sm" />
                      </div>

                      <p className="text-neutral-800 text-sm italic pt-1 leading-relaxed font-normal">
                        "{t.review}"
                      </p>

                      {/* Custom Answers */}
                      {t.customAnswers && t.customAnswers.length > 0 && (
                        <div className="pt-3 mt-2 border-t border-neutral-100 space-y-1">
                          {t.customAnswers.map((ans, aIdx) => (
                            <div key={aIdx} className="text-xs">
                              <span className="text-neutral-400">{ans.question}: </span>
                              <span className="text-neutral-800 font-semibold">{ans.answer}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[11px] text-neutral-400 block pt-1">
                        Submitted on {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-start shrink-0 pt-2 md:pt-0">
                    {/* Approve Button */}
                    {t.status !== 'approved' && (
                      <button
                        onClick={() => handleStatusUpdate(t._id, 'approved')}
                        className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {/* Reject Button */}
                    {t.status !== 'rejected' && (
                      <button
                        onClick={() => handleStatusUpdate(t._id, 'rejected')}
                        className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-all"
                        title="Reject"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}

                    {/* Archive Button */}
                    {t.status !== 'archived' && (
                      <button
                        onClick={() => handleStatusUpdate(t._id, 'archived')}
                        className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border border-neutral-200 transition-all"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    )}

                    {/* Toggle Feature Star */}
                    <button
                      onClick={() => handleToggleFeature(t._id)}
                      className={`p-2 rounded-full border transition-all ${
                        t.featured
                          ? 'bg-amber-100 text-amber-600 border-amber-300 shadow-sm'
                          : 'bg-neutral-100 text-neutral-400 border-neutral-200 hover:text-amber-500'
                      }`}
                      title={t.featured ? 'Unfeature' : 'Mark as Featured'}
                    >
                      <Star className={`w-4 h-4 ${t.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>

                    {/* Toggle Like Heart */}
                    <button
                      onClick={() => handleToggleLike(t._id)}
                      className={`p-2 rounded-full border transition-all ${
                        t.liked
                          ? 'bg-rose-100 text-rose-600 border-rose-300'
                          : 'bg-neutral-100 text-neutral-400 border-neutral-200 hover:text-rose-500'
                      }`}
                      title={t.liked ? 'Unlike' : 'Like'}
                    >
                      <Heart className={`w-4 h-4 ${t.liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteTestimonial(t._id)}
                      className="p-2 rounded-full bg-neutral-100 hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200 transition-all"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

