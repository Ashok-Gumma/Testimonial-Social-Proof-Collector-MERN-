import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fallbackAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
    user?.name || 'admin'
  )}`;
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || fallbackAvatar);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const { data } = await api.patch('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        updateUser(data.user);
        setProfileMessage('Profile updated successfully!');
      }
    } catch (err: any) {
      setProfileMessage(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your personal details, avatar, and security preferences.
        </p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6 sm:p-8 space-y-6 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80">
          <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-neutral-900" /> Personal Profile
          </h3>
          <Badge variant={user?.verified ? 'approved' : 'pending'}>
            {user?.verified ? 'Verified Account' : 'Unverified'}
          </Badge>
        </div>

        {profileMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            {profileMessage}
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Profile Avatar
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview}
                alt={name}
                className="w-16 h-16 rounded-full object-cover bg-neutral-100 border-2 border-neutral-300 shadow-sm"
              />
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-full text-xs font-semibold border border-neutral-200 transition-all">
                <Upload className="w-4 h-4 text-neutral-600" />
                {avatarFile ? 'Change Image' : 'Upload Custom Avatar'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={<UserIcon className="w-4 h-4 text-neutral-400" />}
          />

          <Input
            label="Email Address"
            value={user?.email || ''}
            disabled
            icon={<Mail className="w-4 h-4 text-neutral-400" />}
            hint="Email address is associated with your account login."
          />

          <Button
            type="submit"
            loading={savingProfile}
            className="shadow-sm"
            icon={<Save className="w-4 h-4" />}
          >
            Update Profile
          </Button>
        </form>
      </GlassCard>

      {/* Security & Authentication Info */}
      <GlassCard className="p-6 sm:p-8 space-y-4 bg-white border border-neutral-200/80 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" /> Authentication & Session Security
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Your account is secured using 15-minute JWT Access Tokens and 7-day httpOnly Refresh Token rotation with automatic fallback.
        </p>

        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            <span className="text-neutral-500 block text-[11px]">Access Token Strategy</span>
            <span className="font-bold text-neutral-900">15 min In-Memory JWT</span>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            <span className="text-neutral-500 block text-[11px]">Refresh Token Strategy</span>
            <span className="font-bold text-emerald-700">7-Day httpOnly Cookie Rotation</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

