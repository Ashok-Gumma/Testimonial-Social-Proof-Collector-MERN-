import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Space } from '../../types';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import {
  Layers,
  PlusCircle,
  Edit,
  Trash2,
  Copy,
  Check,
  Globe,
  Heart,
  Inbox,
  BarChart3,
  Code,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';


export const SpacesListPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Copy state per space
  const [copiedLink, setCopiedLink] = useState<{ id: string; type: 'collect' | 'submit' | 'wall' } | null>(null);

  // Delete modal state
  const [deleteSpaceId, setDeleteSpaceId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [seedingDemo, setSeedingDemo] = useState(false);

  const fetchSpaces = async () => {
    setError(null);
    try {
      const { data } = await api.get('/spaces');
      if (data.success) {
        setSpaces(data.spaces || []);
      }
    } catch (e: any) {
      console.error('Failed to load spaces:', e);
      setError(e.response?.data?.message || 'Failed to load spaces.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDemo = async () => {
    setSeedingDemo(true);
    setError(null);
    try {
      const { data } = await api.post('/spaces/seed-demo');
      if (data.success) {
        await fetchSpaces();
      }
    } catch (e: any) {
      console.error('Failed to seed demo spaces:', e);
      setError(e.response?.data?.message || 'Failed to generate demo spaces.');
    } finally {
      setSeedingDemo(false);
    }
  };


  useEffect(() => {
    fetchSpaces();

    const handleRefresh = () => {
      setLoading(true);
      fetchSpaces();
    };

    window.addEventListener('refresh-spaces', handleRefresh);
    return () => {
      window.removeEventListener('refresh-spaces', handleRefresh);
    };
  }, []);

  const handleCopy = (id: string, slug: string, type: 'collect' | 'submit' | 'wall') => {
    const url = `${window.location.origin}/${type}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink({ id, type });
    setTimeout(() => setCopiedLink(null), 2000);
  };


  const handleDeleteSpace = async () => {
    if (!deleteSpaceId) return;
    setDeleting(true);

    try {
      const { data } = await api.delete(`/spaces/${deleteSpaceId}`);
      if (data.success) {
        setSpaces((prev) => prev.filter((s) => s._id !== deleteSpaceId));
        setDeleteSpaceId(null);
      }
    } catch (e) {
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">Your Spaces</h1>
          <p className="text-sm text-neutral-500 font-semibold mt-1">
            Manage your branded collection channels and embed settings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleSeedDemo}
            loading={seedingDemo}
            icon={<Sparkles className="w-4 h-4 text-apple-blue" />}
          >
            Load Demo Spaces
          </Button>
          <Link to="/dashboard/spaces/new">
            <Button icon={<PlusCircle className="w-4 h-4" />}>Create New Space</Button>
          </Link>
        </div>
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
            onClick={fetchSpaces}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            className="shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Grid of Spaces */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      ) : spaces.length === 0 ? (
        <GlassCard className="p-12 text-center bg-white border-neutral-200">
          <Layers className="w-12 h-12 text-neutral-900 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-900">No spaces found</h3>
          <p className="text-sm text-neutral-500 font-semibold mb-6 max-w-sm mx-auto">
            You don't have any spaces yet. Create your first space or load demo spaces with sample testimonials.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard/spaces/new">
              <Button icon={<PlusCircle className="w-4 h-4" />}>Create New Space</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={handleSeedDemo}
              loading={seedingDemo}
              icon={<Sparkles className="w-4 h-4 text-apple-blue" />}
            >
              Load Demo Spaces & Testimonials
            </Button>
          </div>
        </GlassCard>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => {
            const isSubmitCopied =
              copiedLink?.id === space._id && (copiedLink?.type === 'collect' || copiedLink?.type === 'submit');
            const isWallCopied =
              copiedLink?.id === space._id && copiedLink?.type === 'wall';


            return (
              <GlassCard
                key={space._id}
                className="p-6 bg-white border-neutral-200 shadow-apple flex flex-col justify-between"
              >
                <div>
                  {/* Space Title & Logo */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {space.logo ? (
                        <img
                          src={space.logo}
                          alt={space.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-extrabold flex items-center justify-center text-lg shadow-apple">
                          {space.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-neutral-900 text-lg leading-tight">
                          {space.name}
                        </h3>
                        <span className="text-xs text-neutral-500 font-mono font-semibold">
                          /{space.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/dashboard/spaces/${space._id}/edit`}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
                        title="Edit Space"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteSpaceId(space._id)}
                        className="p-1.5 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Space"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-center my-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-neutral-500 uppercase block">
                        Total
                      </span>
                      <span className="text-sm font-extrabold text-neutral-900">
                        {space.totalReviews || 0}
                      </span>
                    </div>
                    <div className="border-x border-neutral-200">
                      <span className="text-[10px] font-extrabold text-neutral-500 uppercase block">
                        Pending
                      </span>
                      <span className="text-sm font-extrabold text-amber-600">
                        {space.pendingReviews || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-neutral-500 uppercase block">
                        Avg Score
                      </span>
                      <span className="text-sm font-extrabold text-emerald-600">
                        {space.avgRating || 5.0} ★
                      </span>
                    </div>
                  </div>

                  {/* Public Link Action Buttons */}
                  <div className="space-y-2 mb-4">
                    <button
                      onClick={() => handleCopy(space._id, space.slug, 'collect')}
                      className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-700 rounded-xl border border-neutral-200 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        Collection Link
                      </span>
                      {isSubmitCopied ? (
                        <span className="text-emerald-700 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(space._id, space.slug, 'wall')}
                      className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-xs font-bold text-neutral-700 rounded-xl border border-neutral-200 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Wall of Love Link
                      </span>
                      {isWallCopied ? (
                        <span className="text-rose-600 flex items-center gap-1 font-bold">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Navigation Footer */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100">
                  <Link to={`/dashboard/spaces/${space._id}/testimonials`}>
                    <Button variant="secondary" size="sm" className="w-full text-[11px] px-1" icon={<Inbox className="w-3 h-3" />}>
                      Inbox
                    </Button>
                  </Link>
                  <Link to={`/dashboard/spaces/${space._id}/analytics`}>
                    <Button variant="secondary" size="sm" className="w-full text-[11px] px-1" icon={<BarChart3 className="w-3 h-3" />}>
                      Analytics
                    </Button>
                  </Link>
                  <Link to={`/dashboard/spaces/${space._id}/embed`}>
                    <Button variant="secondary" size="sm" className="w-full text-[11px] px-1" icon={<Code className="w-3 h-3" />}>
                      Embed
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Delete Space Confirmation Modal */}
      <Modal
        isOpen={!!deleteSpaceId}
        onClose={() => setDeleteSpaceId(null)}
        title="Delete Space Confirmation"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 font-medium">
            Are you sure you want to delete this space? This action will permanently remove all associated customer testimonials.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button variant="outline" size="sm" onClick={() => setDeleteSpaceId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDeleteSpace}>
              Delete Space
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
