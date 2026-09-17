import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Navbar } from '../../components/layout/Navbar';
import { CheckCircle2, XCircle, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        setMessage('No verification token provided in URL.');
        return;
      }

      try {
        const { data } = await api.get(`/auth/verify-email?token=${token}`);
        if (data.success) {
          setSuccess(true);
          setMessage(data.message || 'Your email has been verified successfully!');
        } else {
          setSuccess(false);
          setMessage(data.message || 'Failed to verify email.');
        }
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.response?.data?.message || 'Verification link expired or invalid.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white flex flex-col selection:bg-blue-500/20 selection:text-blue-500 transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Apple ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <GlassCard className="p-8 sm:p-10 text-center border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/40 rounded-3xl backdrop-blur-2xl">
            {loading ? (
              <div className="py-8">
                <div className="w-24 h-24 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner overflow-hidden animate-pulse">
                  <img 
                    src="https://api.dicebear.com/7.x/notionists/svg?seed=CheckingMail&backgroundColor=transparent" 
                    alt="Checking Email" 
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <h3 className="text-xl font-bold tracking-tight">Verifying Email...</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please hold on while we validate your token with ProofPulse.
                </p>
              </div>
            ) : success ? (
              <div className="py-4">
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <div className="w-28 h-28 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=VerifiedHero&backgroundColor=transparent" 
                      alt="Verified Mascot" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#111115]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Confirmed
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Email Verified!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  {message}
                </p>

                <Link to="/dashboard">
                  <Button size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                    Continue to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-4">
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <div className="w-28 h-28 rounded-3xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shadow-inner overflow-hidden">
                    <img 
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=FailedLink&backgroundColor=transparent" 
                      alt="Failed Link" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#111115]">
                    <XCircle className="w-5 h-5" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                  {message}
                </p>

                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
