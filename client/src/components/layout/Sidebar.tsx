import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Inbox,
  BarChart3,
  Code,
  Settings,
  Plus,
  Heart,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  currentSpaceId?: string;
  spaceSlug?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentSpaceId, spaceSlug }) => {
  const navItems = [
    {
      label: 'Overview',
      to: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      label: 'My Spaces',
      to: '/dashboard/spaces',
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const spaceItems = currentSpaceId
    ? [
        {
          label: 'Moderation Inbox',
          to: `/dashboard/spaces/${currentSpaceId}/testimonials`,
          icon: <Inbox className="w-4 h-4" />,
        },
        {
          label: 'Analytics & Insights',
          to: `/dashboard/spaces/${currentSpaceId}/analytics`,
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          label: 'Embed Generator',
          to: `/dashboard/spaces/${currentSpaceId}/embed`,
          icon: <Code className="w-4 h-4" />,
        },
      ]
    : [];

  return (
    <aside className="w-64 border-r border-black/5 dark:border-white/10 bg-white/60 dark:bg-[#0d0d11]/80 backdrop-blur-2xl p-4 flex flex-col justify-between h-[calc(100vh-4.5rem)] sticky top-18 hidden md:flex transition-colors">
      <div className="space-y-6">
        {/* Quick New Space Action */}
        <NavLink
          to="/dashboard/spaces/new"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-apple-blue hover:bg-apple-blueHover text-white rounded-full font-medium text-xs shadow-apple-pill transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Space
        </NavLink>

        {/* Global Nav */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
            Main
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => {
                if (item.to === '/dashboard' && window.location.pathname === '/dashboard') {
                  window.dispatchEvent(new CustomEvent('refresh-dashboard'));
                } else if (item.to === '/dashboard/spaces' && window.location.pathname === '/dashboard/spaces') {
                  window.dispatchEvent(new CustomEvent('refresh-spaces'));
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Space Specific Nav */}
        {currentSpaceId && (
          <div className="space-y-1 pt-4 border-t border-black/5 dark:border-white/5">
            <p className="px-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
              Current Space
            </p>
            {spaceItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

            {spaceSlug && (
              <div className="pt-3 space-y-1">
                <a
                  href={`/submit/${spaceSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  Submit Link ↗
                </a>
                <a
                  href={`/wall/${spaceSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-500" />
                  Wall of Love ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Settings */}
      <div className="pt-4 border-t border-black/5 dark:border-white/5">
        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
              isActive
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

