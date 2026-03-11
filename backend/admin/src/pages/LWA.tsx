import { useEffect, useState, useCallback } from 'react';
import { Search, X, ChevronLeft, ChevronRight, UserCheck, UserX, ArrowLeft, Package } from 'lucide-react';
import { lwaApi, bookingsApi, LWARegistration, Booking, Pagination } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatAmount(amount: string | null | undefined): string {
  if (!amount) return '—';
  return amount;
}

// ─── Ambassador Detail Panel ──────────────────────────────────────────────────

function AmbassadorDetail({
  ambassador,
  onBack,
}: {
  ambassador: LWARegistration;
  onBack: () => void;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    bookingsApi
      .list({ referralCode: ambassador.lwaCode, limit: 100 })
      .then((data) => setBookings(data.bookings))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load bookings')
      )
      .finally(() => setIsLoading(false));
  }, [ambassador.lwaCode]);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ambassadors
        </button>
      </div>

      {/* Ambassador info card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono font-bold text-[#D4AF37] text-lg">{ambassador.lwaCode}</span>
              <StatusBadge status={ambassador.status} type="lwa" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{ambassador.fullName}</h2>
            <p className="text-gray-500 text-sm">{ambassador.email} · {ambassador.phone}</p>
            <p className="text-gray-400 text-xs mt-0.5">{ambassador.city} · {ambassador.occupation}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            Registered {formatDate(ambassador.createdAt)}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
            <div className="text-xs text-gray-500 mt-0.5">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
            <div className="text-xs text-gray-500 mt-0.5">Confirmed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{totalBookings - confirmedBookings}</div>
            <div className="text-xs text-gray-500 mt-0.5">Pending</div>
          </div>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Bookings using {ambassador.lwaCode}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Every customer who entered this referral code when booking</p>
        </div>

        {error ? (
          <div className="p-6 text-center text-red-600 text-sm">{error}</div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm mt-1">Bookings using code {ambassador.lwaCode} will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Service</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Payment</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-gray-600">{booking.bookingRef}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 text-sm">{booking.customerName}</div>
                      <div className="text-gray-400 text-xs">{booking.email}</div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-gray-700 text-xs font-medium">{booking.service}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{formatAmount(booking.amount)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={booking.status} type="booking" />
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell capitalize">
                      {booking.paymentMethod || '—'}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs hidden lg:table-cell">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main LWA List ────────────────────────────────────────────────────────────

export function LWA() {
  const [ambassadors, setAmbassadors] = useState<LWARegistration[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<LWARegistration | null>(null);

  const loadAmbassadors = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await lwaApi.list({
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: search || undefined,
        page,
      });
      setAmbassadors(data.ambassadors);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load ambassadors');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    loadAmbassadors();
  }, [loadAmbassadors]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function clearSearch() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  async function handleToggleStatus(e: React.MouseEvent, ambassador: LWARegistration) {
    e.stopPropagation();
    const newStatus = ambassador.status === 'active' ? 'suspended' : 'active';
    setUpdatingId(ambassador.id);
    try {
      await lwaApi.updateStatus(ambassador.id, newStatus);
      setAmbassadors((prev) =>
        prev.map((a) => (a.id === ambassador.id ? { ...a, status: newStatus } : a))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  // Show detail view when an ambassador is selected
  if (selected) {
    return (
      <AmbassadorDetail
        ambassador={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">LWA Ambassadors</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Libragold Work Ambassador registrations
          {pagination && (
            <span className="ml-2 text-[#D4AF37] font-semibold">
              ({pagination.total} total)
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status filter */}
          <div className="flex gap-2">
            {['All', 'active', 'suspended'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  statusFilter === s
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, code, city..."
              className="w-full pl-9 pr-10 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => {
              setSearch(searchInput);
              setPage(1);
            }}
            className="px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-xl text-sm hover:bg-[#c4a032] transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <button onClick={loadAmbassadors} className="mt-2 text-sm underline">
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : ambassadors.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No ambassadors found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">City</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referrals</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ambassadors.map((ambassador) => (
                  <tr
                    key={ambassador.id}
                    onClick={() => setSelected(ambassador)}
                    className="hover:bg-amber-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#D4AF37] text-xs">
                        {ambassador.lwaCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{ambassador.fullName}</td>
                    <td className="py-3 px-4 text-gray-600 hidden md:table-cell">{ambassador.email}</td>
                    <td className="py-3 px-4 text-gray-600 hidden sm:table-cell">{ambassador.phone}</td>
                    <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">{ambassador.city}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                        {ambassador.totalReferrals}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={ambassador.status} type="lwa" />
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">
                      {formatDate(ambassador.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => handleToggleStatus(e, ambassador)}
                        disabled={updatingId === ambassador.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                          ambassador.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {updatingId === ambassador.id ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : ambassador.status === 'active' ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
