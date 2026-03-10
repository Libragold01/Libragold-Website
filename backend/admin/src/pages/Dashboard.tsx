import { useEffect, useState } from 'react';
import {
  CalendarCheck, Clock, CheckCircle, Users, TrendingUp, RefreshCw, CheckSquare,
  HeartHandshake, Map, Building2, FileCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, DashboardStats } from '../lib/api';
import { StatsCard } from '../components/StatsCard';
import { StatusBadge } from '../components/StatusBadge';


const SERVICE_COLORS: Record<string, string> = {
  Pilgrimage: 'bg-emerald-500',
  Hotel: 'bg-blue-500',
  Tour: 'bg-purple-500',
  Visa: 'bg-orange-500',
  Ticketing: 'bg-pink-500',
  Admission: 'bg-teal-500',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function loadStats() {
    try {
      setError('');
      const data = await dashboardApi.stats();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    loadStats();
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 w-32 bg-gray-200 rounded-lg" />
            <div className="h-4 w-56 bg-gray-100 rounded" />
          </div>
          <div className="h-9 w-24 bg-gray-200 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-20 bg-gray-100 rounded" />
                <div className="h-8 w-12 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-2 bg-gray-100 rounded-full w-full" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="h-5 w-32 bg-gray-200 rounded" />
          </div>
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-6">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
                <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
        <p className="font-medium">{error}</p>
        <button
          onClick={loadStats}
          className="mt-3 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const maxService = Math.max(...Object.values(stats.bookings.byService), 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview of all bookings and ambassadors</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pilgrimages', icon: HeartHandshake, to: '/pilgrimages', color: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' },
          { label: 'Tours', icon: Map, to: '/tours', color: 'bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100' },
          { label: 'Hotels', icon: Building2, to: '/hotels', color: 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100' },
          { label: 'Visa Packages', icon: FileCheck, to: '/visa-packages', color: 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100' },
        ].map(({ label, icon: Icon, to, color }) => (
          <motion.button
            key={label}
            onClick={() => navigate(to)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${color}`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </motion.button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { title: 'Total Bookings', value: stats.bookings.total, icon: CalendarCheck, color: 'gold' as const, subtitle: 'All time' },
          { title: 'Pending', value: stats.bookings.byStatus.pending ?? 0, icon: Clock, color: 'yellow' as const, subtitle: 'Awaiting action' },
          { title: 'Confirmed', value: stats.bookings.byStatus.confirmed ?? 0, icon: CheckCircle, color: 'green' as const, subtitle: 'Ready to go' },
          { title: 'Completed', value: stats.bookings.byStatus.completed ?? 0, icon: CheckSquare, color: 'blue' as const, subtitle: 'Fulfilled' },
          { title: 'LWA Ambassadors', value: stats.ambassadors.total, icon: Users, color: 'purple' as const, subtitle: `${stats.ambassadors.active} active` },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <StatsCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Service */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            Bookings by Service
          </h2>
          <div className="space-y-3">
            {Object.entries(stats.bookings.byService).map(([service, count]) => (
              <div key={service}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{service}</span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${SERVICE_COLORS[service] || 'bg-gray-400'} transition-all duration-500`}
                    style={{ width: `${(count / maxService) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Statuses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
            Booking Status Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Pending', key: 'pending', color: 'border-yellow-400', text: 'text-yellow-600', bg: 'bg-yellow-50' },
              { label: 'Confirmed', key: 'confirmed', color: 'border-green-400', text: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Cancelled', key: 'cancelled', color: 'border-red-400', text: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Completed', key: 'completed', color: 'border-blue-400', text: 'text-blue-600', bg: 'bg-blue-50' },
            ].map(({ label, key, color, text, bg }) => (
              <div
                key={key}
                className={`${bg} border-l-4 ${color} rounded-xl p-4`}
              >
                <div className={`text-2xl font-bold ${text}`}>
                  {stats.bookings.byStatus[key] ?? 0}
                </div>
                <div className="text-sm text-gray-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Ambassador summary */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              Ambassadors
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 border-l-4 border-green-400 rounded-xl p-3">
                <div className="text-xl font-bold text-green-600">{stats.ambassadors.active}</div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <div className="bg-red-50 border-l-4 border-red-400 rounded-xl p-3">
                <div className="text-xl font-bold text-red-600">{stats.ambassadors.suspended}</div>
                <div className="text-xs text-gray-600">Suspended</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6">
                    <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                      {booking.bookingRef}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">{booking.customerName}</td>
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {booking.service}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-700">{booking.amount || '—'}</td>
                  <td className="py-3 px-6">
                    <StatusBadge status={booking.status || 'pending'} />
                  </td>
                  <td className="py-3 px-6 text-gray-500 text-xs">
                    {booking.createdAt ? formatDate(booking.createdAt) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentBookings.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No bookings yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
