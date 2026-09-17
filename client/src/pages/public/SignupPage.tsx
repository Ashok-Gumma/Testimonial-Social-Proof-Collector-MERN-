import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/GlassCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Navbar } from '../../components/layout/Navbar';
import { User, Mail, Lock, UserPlus, AlertCircle, Check } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signup(name, email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Signup failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = password.length >= 6;

  return (
    <div className="min-h-screen bg-apple-lightBg dark:bg-apple-darkBg text-neutral-900 dark:text-neutral-100 font-sans flex flex-col transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <GlassCard className="p-8 sm:p-10 bg-white/80 dark:bg-[#121216]/80 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-apple-dark">
            {/* Notion-Style Cartoon Mascot Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-apple-blue/10 dark:bg-apple-blue/20 border border-apple-blue/20 flex items-center justify-center mx-auto mb-4 overflow-hidden p-1 shadow-apple-glow">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=SignupCreator&backgroundColor=transparent"
                  alt="Mascot"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Create your Account
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
                Collect and showcase customer reviews in minutes
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-apple-sm bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                icon={<User className="w-4 h-4" />}
              />

              <Input
                label="Work Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-4 h-4" />}
              />

              {/* Real-time Apple Password Requirement Indicator */}
              <div className="flex items-center gap-2 text-xs py-1">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    isPasswordValid
                      ? 'bg-emerald-500 text-white'
                      : 'bg-neutral-200 dark:bg-white/10 text-neutral-400'
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span
                  className={
                    isPasswordValid
                      ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                      : 'text-neutral-400'
                  }
                >
                  At least 6 characters
                </span>
              </div>

              <Button
                type="submit"
                variant="apple-blue"
                loading={loading}
                className="w-full py-3 text-sm font-semibold shadow-apple-pill mt-2"
                icon={<UserPlus className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>

            <div className="text-center mt-6 text-xs text-neutral-500 dark:text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-apple-blue hover:underline font-semibold ml-1">
                Sign in
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

