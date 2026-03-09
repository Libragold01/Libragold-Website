import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, CreditCard, Users, FileText, LogOut,
  Menu, X, HeartHandshake, Map, Building2, FileCheck, ChevronDown, ChevronLeft,
  ShieldCheck, UserCog,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface NavItem { to: string; icon: React.ElementType; label: string; superAdminOnly?: boolean; }
interface NavGroup { label: string; items: NavItem[]; superAdminOnly?: boolean; }

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/bookings', icon: CalendarCheck, label: 'Bookings' },
      { to: '/payments', icon: CreditCard, label: 'Payments' },
    ],
  },
  {
    label: 'Manage Listings',
    superAdminOnly: true,
    items: [
      { to: '/pilgrimages', icon: HeartHandshake, label: 'Pilgrimages', superAdminOnly: true },
      { to: '/tours', icon: Map, label: 'Tours', superAdminOnly: true },
      { to: '/hotels', icon: Building2, label: 'Hotels', superAdminOnly: true },
      { to: '/visa-packages', icon: FileCheck, label: 'Visa Packages', superAdminOnly: true },
    ],
  },
  {
    label: 'People',
    items: [{ to: '/lwa', icon: Users, label: 'LWA Ambassadors' }],
  },
  {
    label: 'Settings',
    superAdminOnly: true,
    items: [
      { to: '/content', icon: FileText, label: 'Site Content', superAdminOnly: true },
      { to: '/admins', icon: UserCog, label: 'Admin Accounts', superAdminOnly: true },
    ],
  },
];

function SidebarNavGroup({
  group, onNavigate, isSuperAdmin,
}: { group: NavGroup; onNavigate: () => void; isSuperAdmin: boolean }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  if (group.superAdminOnly && !isSuperAdmin) return null;
  const visibleItems = group.items.filter(item => !item.superAdminOnly || isSuperAdmin);
  if (visibleItems.length === 0) return null;

  const isGroupActive = visibleItems.some((item) => location.pathname.startsWith(item.to));

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5"
      >
        <span className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${isGroupActive ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
          {group.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {visibleItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-0.5 ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.07]'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({ onNavigate, onClose }: { onNavigate: () => void; onClose?: () => void }) {
  const { admin, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/[0.07] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Libragold" className="w-9 h-9 rounded-xl object-contain flex-shrink-0" />
          <div>
            <div className="text-white font-bold text-sm tracking-wide">LIBRAGOLD</div>
            <div className="text-gray-500 text-xs">Admin Panel</div>
          </div>
        </div>
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-2">
        {navGroups.map((group) => (
          <SidebarNavGroup
            key={group.label}
            group={group}
            onNavigate={onNavigate}
            isSuperAdmin={isSuperAdmin}
          />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 bg-[#D4AF37]/15 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#D4AF37] text-xs font-bold">
              {admin?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white text-sm font-medium truncate">{admin?.username}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Super Admin
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function Layout() {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <motion.aside
        initial={false}
        animate={{ width: desktopCollapsed ? 0 : 240 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:block bg-[#0f1623] flex-shrink-0 border-r border-white/[0.06] overflow-hidden"
      >
        <div className="w-60 h-full flex flex-col">
          <SidebarContent onNavigate={() => {}} onClose={() => setDesktopCollapsed(true)} />
        </div>
      </motion.aside>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.aside
            initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-50 w-60 bg-[#0f1623] flex flex-col lg:hidden"
          >
            <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setMobileSidebarOpen(true)} className="text-gray-600 hover:text-gray-900 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Libragold" className="w-7 h-7 rounded-lg object-contain" />
            <span className="font-bold text-gray-900 text-sm">Libragold Admin</span>
          </div>
        </header>

        <header className="hidden lg:flex bg-white border-b border-gray-200 px-4 py-3 items-center gap-3 flex-shrink-0 shadow-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDesktopCollapsed((v) => !v)}
            className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-all"
            title={desktopCollapsed ? 'Open sidebar' : 'Collapse sidebar'}
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          <AnimatePresence mode="wait">
            {desktopCollapsed && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-2"
              >
                <img src="/logo.png" alt="Libragold" className="w-7 h-7 rounded-lg object-contain" />
                <span className="font-bold text-gray-900 text-sm">Libragold Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="p-6 min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
