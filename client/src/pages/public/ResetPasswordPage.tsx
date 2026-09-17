import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Navbar } from '../../components/layout/Navbar';
import { Lock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white flex flex-col selection:bg-blue-500/20 selection:text-blue-500 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Apple subtle ambient radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <GlassCard className="p-8 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/40 rounded-3xl backdrop-blur-2xl">
            {success ? (
              <div className="text-center py-4">
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <div className="w-28 h-28 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=SafeVault&backgroundColor=transparent" 
                      alt="Security Mascot" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#111115]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Password Updated
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  Your Apple-grade security credentials have been updated. You can now sign in with your new password.
                </p>

                <Link to="/login">
                  <Button size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                    Sign In Now
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  {/* Notion hand-drawn cartoon mascot */}
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center shadow-inner overflow-hidden">
                      <img 
                        src="https://api.dicebear.com/7.x/notionists/svg?seed=PassKey&backgroundColor=transparent" 
                        alt="Security Mascot" 
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-[#111115]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Set New Password
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                    Enter a secure password for your ProofPulse account
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4"
                    loading={loading}
                    icon={<Lock className="w-4 h-4" />}
                  >
                    Update Password
                  </Button>
                </form>

                <div className="mt-8 text-center border-t border-slate-200/70 dark:border-white/5 pt-6">
                  <Link
                    to="/login"
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
