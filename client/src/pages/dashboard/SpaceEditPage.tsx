import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { StarRating } from '../../components/common/StarRating';
import {
  Upload,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Eye,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const SpaceEditPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Header Title');
  const [prompt, setPrompt] = useState('Could you please take 60 seconds to share your experience with us?');
  const [requireAvatar, setRequireAvatar] = useState(false);
  const [enableRating, setEnableRating] = useState(true);
  const [accentColor, setAccentColor] = useState('#171717');
  const [customQuestions, setCustomQuestions] = useState<string[]>([
    'What is the #1 problem we helped you solve?',
  ]);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [name, isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    const loadSpace = async () => {
      try {
        const { data } = await api.get(`/spaces/${id}`);
        if (data.success) {
          const sp = data.space;
          setName(sp.name);
          setSlug(sp.slug);
          setHeaderTitle(sp.headerTitle || 'Header Title');
          setPrompt(sp.prompt);
          setRequireAvatar(sp.requireAvatar);
          setEnableRating(sp.enableRating);
          setAccentColor(sp.accentColor || '#171717');
          setCustomQuestions(sp.customQuestions || []);
          if (sp.logo) setLogoPreview(sp.logo);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load space data.');
      } finally {
        setLoading(false);
      }
    };

    loadSpace();
  }, [id, isEditing]);

  const handleAddQuestion = () => {
    if (customQuestions.length >= 5) return;
    setCustomQuestions([...customQuestions, '']);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...customQuestions];
    updated[index] = value;
    setCustomQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Space name is required.');
      return;
    }

    if (!slug.trim()) {
      setError('Slug is required.');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('headerTitle', headerTitle);
      formData.append('prompt', prompt);
      formData.append('requireAvatar', requireAvatar.toString());
      formData.append('enableRating', enableRating.toString());
      formData.append('accentColor', accentColor);
      formData.append('customQuestions', JSON.stringify(customQuestions.filter((q) => q.trim().length > 0)));

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (isEditing) {
        await api.patch(`/spaces/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/spaces', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/dashboard/spaces');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving space configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-10 h-10 text-neutral-900 animate-spin mx-auto mb-3" />
        <p className="text-sm text-neutral-500 font-semibold">Loading space settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/dashboard/spaces')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 mb-2 font-bold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Spaces
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            {isEditing ? `Edit Space: ${name}` : 'Create New Space'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#fff1f2] border border-[#fecdd3] text-[#991b1b] text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Split Screen Layout: Left Form, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Configuration (7 cols) */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 sm:p-8 bg-white border-neutral-200 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Space Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                  Basic Configuration
                </h3>

                <Input
                  label="Space Name *"
                  placeholder="e.g. Acme SaaS Platform"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Public URL Slug *"
                  placeholder="acme-saas"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                  hint={`Public link will be: ${window.location.origin}/submit/${slug || 'your-slug'}`}
                />

                {/* Logo Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Space Logo
                  </label>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 font-extrabold">
                        {name ? name.charAt(0).toUpperCase() : 'L'}
                      </div>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-2xl text-xs font-bold border border-neutral-200 transition-colors">
                      <Upload className="w-4 h-4 text-neutral-900" />
                      {logoFile ? 'Change Logo' : 'Upload Space Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Prompt Customization */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                  Prompt & Messages
                </h3>

                <Input
                  label="Header Title"
                  placeholder="Header Title"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                />

                <Textarea
                  label="Custom Prompt Message *"
                  placeholder="Would you mind taking 60 seconds to share your experience with us?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                  Form Toggles
                </h3>

                <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div>
                    <span className="text-sm font-bold block text-neutral-900">
                      Enable Star Rating
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      Allow customers to select 1 to 5 stars
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableRating}
                    onChange={(e) => setEnableRating(e.target.checked)}
                    className="w-5 h-5 rounded border-neutral-300 bg-white text-neutral-900 focus:ring-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <div>
                    <span className="text-sm font-bold block text-neutral-900">
                      Require Customer Avatar
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">
                      Make image upload mandatory for reviewers
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireAvatar}
                    onChange={(e) => setRequireAvatar(e.target.checked)}
                    className="w-5 h-5 rounded border-neutral-300 bg-white text-neutral-900 focus:ring-neutral-900"
                  />
                </div>
              </div>

              {/* Custom Questions Builder */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
                    Custom Questions ({customQuestions.length}/5)
                  </h3>
                  {customQuestions.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {customQuestions.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        placeholder={`Question #${idx + 1}`}
                        value={q}
                        onChange={(e) => handleQuestionChange(idx, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-2.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors mt-5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-neutral-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/spaces')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={saving}
                  className="shadow-apple"
                  icon={<Save className="w-4 h-4" />}
                >
                  {isEditing ? 'Save Changes' : 'Create Space'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider px-1">
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-neutral-900" /> Live Customer Preview
            </span>
            <span className="text-emerald-700 font-bold">Real-Time Sync</span>
          </div>

          <GlassCard className="p-6 bg-white border-neutral-200 shadow-apple sticky top-24 pointer-events-none">
            <div className="text-center mb-6">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-12 h-12 rounded-2xl object-cover mx-auto mb-3 border border-neutral-200 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white font-extrabold flex items-center justify-center text-lg mx-auto mb-3 shadow-apple">
                  {name ? name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <h4 className="font-extrabold text-neutral-900 text-xl">{name || 'Space Name'}</h4>
              <p className="text-xs text-neutral-600 mt-2 bg-neutral-100 p-2.5 rounded-2xl border border-neutral-200 font-semibold">
                {prompt}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {enableRating && (
                <div className="text-center p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-neutral-500 font-bold block mb-1">Star Rating</span>
                  <div className="flex justify-center">
                    <StarRating rating={5} readOnly size="sm" />
                  </div>
                </div>
              )}

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-400 font-semibold">
                Testimonial text area...
              </div>

              {customQuestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  {customQuestions.map(
                    (q, idx) =>
                      q && (
                        <div key={idx} className="p-2 bg-neutral-50 rounded-xl text-neutral-600 font-medium">
                          {q}
                        </div>
                      )
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="p-2 bg-neutral-50 rounded-xl text-neutral-400 font-semibold">Customer Name *</div>
                <div className="p-2 bg-slate-50 rounded-xl text-neutral-400 font-semibold">Email Address *</div>
              </div>

              <Button size="sm" className="w-full text-xs py-2 shadow-apple">
                Send Testimonial ❤️
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
