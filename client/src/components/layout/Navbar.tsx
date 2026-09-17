import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, LayoutDashboard, Layers, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cartoonAvatar = user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user?.name || 'User')}&backgroundColor=transparent`;

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <nav className="apple-glass-nav max-w-7xl mx-auto rounded-full px-5 py-2.5 flex items-center justify-between shadow-apple-sm transition-all">
        {/* Brand Logo with Notion Cartoon Mascot */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=PulseIcon&backgroundColor=0071e3"
              alt="ProofPulse"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
              Proof<span className="text-apple-blue">Pulse</span>
            </span>
          </div>
        </Link>

        {/* Right Nav & Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Apple Sun/Moon Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/30" />
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <NavLink
                to="/dashboard"
                end
                onClick={() => {
                  if (window.location.pathname === '/dashboard') {
                    window.dispatchEvent(new CustomEvent('refresh-dashboard'));
                  }
                }}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10'
                  }`
                }
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-apple-blue" />
                Dashboard
              </NavLink>
              <NavLink
                to="/dashboard/spaces"
                onClick={() => {
                  if (window.location.pathname === '/dashboard/spaces') {
                    window.dispatchEvent(new CustomEvent('refresh-spaces'));
                  }
                }}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10'
                  }`
                }
              >
                <Layers className="w-3.5 h-3.5 text-apple-purple" />
                Spaces
              </NavLink>

              {/* Profile Avatar */}
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
              >
                <img
                  src={cartoonAvatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover bg-neutral-100 dark:bg-neutral-800 border border-black/10 dark:border-white/10"
                />
                <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 hidden sm:inline">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 text-neutral-400 hover:text-red-500 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-apple-blue hover:bg-apple-blueHover rounded-full shadow-apple-pill transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

