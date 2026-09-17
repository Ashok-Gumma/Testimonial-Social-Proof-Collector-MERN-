import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { StarRating } from '../../components/common/StarRating';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Code,
  Layers,
  ArrowRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Share2,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const cartoonAvatars = [
    { name: 'Alex Rivera', role: 'Head of Growth', seed: 'Alex', avatarBg: 'f3f4f6' },
    { name: 'Sarah Chen', role: 'Founder & CEO', seed: 'Sarah', avatarBg: 'e0e7ff' },
    { name: 'Marcus Brody', role: 'Lead Architect', seed: 'Marcus', avatarBg: 'ecfdf5' },
    { name: 'Elena Rostova', role: 'Product Design', seed: 'Elena', avatarBg: 'fef3c7' },
    { name: 'David Kim', role: 'VP Engineering', seed: 'David', avatarBg: 'fce7f3' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#08080a] text-slate-900 dark:text-white font-sans flex flex-col selection:bg-blue-500/20 selection:text-blue-500 transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center flex-1 flex flex-col justify-center items-center overflow-hidden">
        {/* Apple subtle radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 dark:from-blue-600/15 dark:via-purple-600/10 dark:to-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Apple pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-8 backdrop-blur-xl shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Next-Gen Social Proof • Notion Art with Apple Precision</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.05 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.12] mb-6"
        >
          Turn Real Customer Praise into{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            Instant Conversions.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.1 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed font-normal"
        >
          Collect verified testimonials with dedicated branded spaces, approve with Apple-grade moderation, and embed sleek Wall of Love widgets anywhere.
        </motion.p>

        {/* Notion Cartoon Social Proof Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-10 inline-flex items-center gap-3.5 px-4 py-2 bg-white/80 dark:bg-[#111115]/80 border border-slate-200/80 dark:border-white/10 rounded-full shadow-lg shadow-black/5 dark:shadow-black/20 backdrop-blur-xl"
        >
          <div className="flex -space-x-2">
            {cartoonAvatars.map((c, i) => (
              <img
                key={i}
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${c.seed}&backgroundColor=${c.avatarBg}`}
                alt={c.name}
                className="w-7 h-7 rounded-full border-2 border-white dark:border-[#111115] object-cover bg-slate-100"
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9 / 5.0 rating from 2,400+ verified businesses</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 shadow-xl shadow-blue-500/20" icon={<Zap className="w-5 h-5 fill-white" />}>
              Create Free Space
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8" icon={<ArrowRight className="w-4 h-4" />}>
              Sign In to ProofPulse
            </Button>
          </Link>
        </motion.div>

        {/* Live Interactive Notion-Apple Preview Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="w-full max-w-4xl mt-16 relative"
        >
          <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-200/80 via-slate-200/40 to-transparent dark:from-white/15 dark:via-white/5 dark:to-transparent shadow-2xl shadow-black/10 dark:shadow-black/60">
            <div className="rounded-[22px] bg-white/95 dark:bg-[#111115]/95 backdrop-blur-2xl p-6 sm:p-8 border border-slate-200/60 dark:border-white/5">
              {/* macOS window controls */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-white/5 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-3 text-xs font-mono text-slate-400 dark:text-slate-500">
                    proofpulse.io/preview
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live Production Engine
                </div>
              </div>

              {/* Grid of sample cartoon testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=e0e7ff"
                      alt="Sarah"
                      className="w-11 h-11 rounded-2xl border border-slate-200 dark:border-white/10 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Chen</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Founder @ TechFlow</p>
                    </div>
                  </div>
                  <StarRating rating={5} readOnly size="sm" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    "Our demo conversions jumped 42% within one week of embedding ProofPulse Wall of Love on our landing page. The Notion style cartoons make our brand unforgettable!"
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 hover:border-blue-500/40 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=ecfdf5"
                      alt="Marcus"
                      className="w-11 h-11 rounded-2xl border border-slate-200 dark:border-white/10 object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Marcus Brody</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Growth Lead @ Pulse</p>
                    </div>
                  </div>
                  <StarRating rating={5} readOnly size="sm" />
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    "Setting up a collection space took less than 2 minutes. The Apple-like moderation inbox made reviewing 100+ customer testimonials smooth and joyful."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mt-24 text-left">
          <GlassCard className="p-7 border border-slate-200/80 dark:border-white/10 hover:shadow-xl transition-all duration-300 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Branded Spaces</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Create unique collection links with custom logos, tailored prompts, and specific questions for your customers.
            </p>
          </GlassCard>

          <GlassCard className="p-7 border border-slate-200/80 dark:border-white/10 hover:shadow-xl transition-all duration-300 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Apple-Grade Moderation</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Review incoming testimonials, feature the best social proof, tag sentiment, and batch-publish with zero effort.
            </p>
          </GlassCard>

          <GlassCard className="p-7 border border-slate-200/80 dark:border-white/10 hover:shadow-xl transition-all duration-300 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Instant Embeds</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Generate Masonry Walls, Carousels, or Badges with ready-to-paste iframe and HTML snippets for any website.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Apple minimalist footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-[#08080a]/50 backdrop-blur-xl py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=ProofPulseLogo&backgroundColor=transparent"
              alt="Mascot"
              className="w-6 h-6"
            />
            <span>© 2026 ProofPulse SaaS. Connected to live MongoDB Atlas cluster.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-blue-500 transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-blue-500 transition-colors">Register</Link>
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
