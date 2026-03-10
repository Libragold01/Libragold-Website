import { useEffect, useState, useCallback } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { bookingsApi, Booking, Pagination } from '../lib/api';
import { BookingTable } from '../components/BookingTable';
import { StatusBadge } from '../components/StatusBadge';
import { useToast } from '../components/Toast';

const SERVICES = ['All', 'Pilgrimage', 'Hotel', 'Tour', 'Visa', 'Ticketing', 'Admission'];
const STATUSES = ['All', 'pending', 'confirmed', 'cancelled', 'completed'];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Bookings() {
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await bookingsApi.list({
        service: selectedService !== 'All' ? selectedService : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        search: search || undefined,
        page,
      });
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, [selectedService, selectedStatus, search, page]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

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

  async function handleStatusChange(id: number, status: string) {
    setUpdatingId(id);
    try {
      await bookingsApi.updateStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      if (selectedBooking?.id === id) {
        setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
      }
      showToast(`Booking status updated to "${status}"`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  }

  async function exportCSV() {
    setExporting(true);
    try {
      const data = await bookingsApi.list({
        service: selectedService !== 'All' ? selectedService : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        search: search || undefined,
        limit: 1000,
      });
      const rows = data.bookings;
      const headers = ['Ref', 'Name', 'Email', 'Phone', 'Service', 'Amount', 'Payment', 'Status', 'Referral', 'Date'];
      const csv = [
        headers.join(','),
        ...rows.map((b) =>
          [
            b.bookingRef, b.customerName, b.email, b.phone, b.service,
            b.amount || '', b.paymentMethod || '', b.status, b.referralCode || '',
            new Date(b.createdAt).toLocaleDateString('en-NG'),
          ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${rows.length} bookings`, 'success');
    } catch {
      showToast('Export failed. Try again.', 'error');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage all customer bookings
            {pagination && (
              <span className="ml-2 text-[#D4AF37] font-semibold">
                ({pagination.total} total)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={exporting || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 flex-shrink-0"
        >
          <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
        {/* Service tabs */}
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedService(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedService === s
                  ? 'bg-[#D4AF37] text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status filter + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, ref..."
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
            onClick={handleSearch as unknown as React.MouseEventHandler}
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
            <button onClick={loadBookings} className="mt-2 text-sm underline">
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="animate-pulse divide-y divide-gray-50">
            <div className="px-6 py-3 flex gap-6 border-b border-gray-100 bg-gray-50">
              {['w-24', 'w-32', 'w-28', 'w-20', 'w-16', 'w-20', 'w-20', 'w-24'].map((w, i) => (
                <div key={i} className={`h-3 ${w} bg-gray-200 rounded`} />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex gap-6 items-center">
                <div className="h-4 w-24 bg-gray-200 rounded font-mono" />
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-4 w-28 bg-gray-100 rounded" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
                <div className="h-4 w-16 bg-gray-100 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-full ml-auto" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <BookingTable
            bookings={bookings}
            onRowClick={setSelectedBooking}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
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

      {/* Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <span className="font-mono text-sm font-semibold text-[#D4AF37]">
                  {selectedBooking.bookingRef}
                </span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</label>
                <p className="mt-1 font-semibold text-gray-900">{selectedBooking.customerName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</label>
                <p className="mt-1 font-semibold text-gray-900">{selectedBooking.service}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                <p className="mt-1 text-gray-700">{selectedBooking.email}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                <p className="mt-1 text-gray-700">{selectedBooking.phone}</p>
              </div>
              {selectedBooking.amount && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
                  <p className="mt-1 font-bold text-[#D4AF37]">{selectedBooking.amount}</p>
                </div>
              )}
              {selectedBooking.paymentMethod && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</label>
                  <p className="mt-1 text-gray-700">{selectedBooking.paymentMethod}</p>
                </div>
              )}
              {selectedBooking.referralCode && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral Code</label>
                  <p className="mt-1 font-mono font-bold text-purple-600">{selectedBooking.referralCode}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                <p className="mt-1 text-gray-700">{formatDate(selectedBooking.createdAt)}</p>
              </div>
            </div>

            {/* Status change */}
            <div className="flex items-center gap-3 mb-6">
              <label className="text-sm font-semibold text-gray-700">Status:</label>
              <StatusBadge status={selectedBooking.status} />
              <select
                value={selectedBooking.status}
                disabled={updatingId === selectedBooking.id}
                onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                className="ml-auto border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:opacity-50"
              >
                {['pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Full details */}
            {Object.keys(selectedBooking.details).length > 0 && (
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Form Details
                </label>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {Object.entries(selectedBooking.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-500 font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-gray-900 text-right">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
