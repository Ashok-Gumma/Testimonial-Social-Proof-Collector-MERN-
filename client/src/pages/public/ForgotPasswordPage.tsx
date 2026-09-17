import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Navbar } from '../../components/layout/Navbar';
import { Mail, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setResetLink(null);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.success) {
        setMessage(data.message);
        if (data.resetLink) {
          setResetLink(data.resetLink);
        }
      }
    } catch (err: any) {
      setMessage('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-apple-lightBg dark:bg-apple-darkBg text-neutral-900 dark:text-neutral-100 font-sans flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <GlassCard className="p-8 sm:p-10 bg-white/80 dark:bg-[#121216]/80 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-apple-dark">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-apple-blue/10 dark:bg-apple-blue/20 border border-apple-blue/20 flex items-center justify-center mx-auto mb-4 shadow-apple-glow text-apple-blue">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Forgot password?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                Enter your registered email to reset your credentials
              </p>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-apple-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {message}
                </div>
                {resetLink && (
                  <div className="pt-2 border-t border-emerald-500/20">
                    <Link
                      to={resetLink}
                      className="text-apple-blue hover:underline font-mono text-[11px] break-all block font-semibold"
                    >
                      Click here to reset your password →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-4 h-4" />}
              />

              <Button
                type="submit"
                variant="apple-blue"
                loading={loading}
                className="w-full py-3 text-sm font-semibold shadow-apple-pill"
              >
                Send Reset Link
              </Button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign in
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

