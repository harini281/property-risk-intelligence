import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Search, CloudRain, History, Waves, CloudHail,
  CloudLightning, Brain, HardHat, TrendingUp, FileText, Settings, Shield,
  LogOut, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/search', label: 'Property Search', icon: Search },
  { to: '/app/weather', label: 'Live Weather', icon: CloudRain },
  { to: '/app/storms', label: 'Historical Storms', icon: History },
  { to: '/app/flood', label: 'Flood Intelligence', icon: Waves },
  { to: '/app/hail', label: 'Hail Intelligence', icon: CloudHail },
  { to: '/app/hurricane', label: 'Hurricane Center', icon: CloudLightning },
  { to: '/app/ai', label: 'AI Predictions', icon: Brain },
  { to: '/app/contractor', label: 'Contractor Intelligence', icon: HardHat },
  { to: '/app/climate', label: 'Climate Analytics', icon: TrendingUp },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-ink-950/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-ink-950 flex flex-col transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm tracking-tight">RiskIntel</h1>
              <p className="text-ink-500 text-[10px]">Property Risk Platform</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-ink-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn('nav-item', isActive && 'nav-item-active')
                }
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-brand-600/20 flex items-center justify-center text-brand-400 font-semibold text-sm">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.email ?? 'User'}</p>
              <p className="text-ink-500 text-xs">Enterprise Plan</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="nav-item w-full text-ink-400 hover:text-risk-high"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
