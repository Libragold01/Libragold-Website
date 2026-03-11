import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, Clock, User, Tag, Layers, Calendar, Hash } from 'lucide-react';
import { paymentsApi, Payment, Pagination } from '../lib/api';
import { StatusBadge } from '../components/StatusBadge';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAmount(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

const STATUS_OPTIONS = ['all', 'pending', 'success', 'failed'];

function paymentStatusToLwa(status: string): string {
  if (status === 'success') return 'active';
  if (status === 'failed') return 'suspended';
  return 'pending';
}

// ─── Payment Detail Modal ─────────────────────────────────────────────────────

function PaymentDetailModal({
  payment,
  onClose,
}: {
  payment: Payment;
  onClose: () => void;
}) {
  const statusIcon =
    payment.status === 'success' ? (
      <CheckCircle className="w-8 h-8 text-green-500" />
    ) : payment.status === 'failed' ? (
      <XCircle className="w-8 h-8 text-red-500" />
    ) : (
      <Clock className="w-8 h-8 text-amber-500" />
    );

  const statusColor =
    payment.status === 'success'
      ? 'bg-green-50 border-green-200'
      : payment.status === 'failed'
      ? 'bg-red-50 border-red-200'
      : 'bg-amber-50 border-amber-200';

  // Parse useful fields out of lotusData if present
  const lotus = payment.lotusData as Record<string, unknown> | null;
  const lotusRef =
    (lotus?.data as Record<string, unknown>)?.reference ??
    (lotus?.reference as string) ??
    null;
  const lotusMsg =
    (lotus?.message as string) ??
    (lotus?.data as Record<string, unknown>)?.message ??
    null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-5 border-b ${statusColor} rounded-t-2xl`}>
            <div className="flex items-center gap-3">
              {statusIcon}
              <div>
                <p className="font-mono text-sm font-bold text-gray-800">{payment.reference}</p>
                <p className="text-xs text-gray-500 capitalize">{payment.status} · {payment.method}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Amount */}
            <div className="text-center py-3 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900">{formatAmount(payment.amount)}</div>
              {payment.isInstallment && payment.installmentNumber != null && payment.installmentTotal != null && (
                <div className="text-sm text-purple-600 font-semibold mt-1">
                  Installment {payment.installmentNumber} of {payment.installmentTotal}
                </div>
              )}
              {payment.currency && payment.currency !== 'NGN' && (
                <div className="text-xs text-gray-400 mt-0.5">{payment.currency}</div>
              )}
            </div>

            {/* Booking info */}
            {payment.booking && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking</p>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                  <Row icon={<Hash className="w-4 h-4" />} label="Booking Ref" value={payment.booking.bookingRef} mono />
                  <Row icon={<User className="w-4 h-4" />} label="Customer" value={payment.booking.customerName} />
                  <Row icon={<Tag className="w-4 h-4" />} label="Email" value={payment.booking.email} />
                  <Row icon={<Layers className="w-4 h-4" />} label="Service" value={payment.booking.service} />
                </div>
              </div>
            )}

            {/* Payment details */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Details</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                <Row icon={<Hash className="w-4 h-4" />} label="Reference" value={payment.reference} mono />
                {lotusRef && lotusRef !== payment.reference && (
                  <Row icon={<Hash className="w-4 h-4" />} label="Lotus Ref" value={String(lotusRef)} mono />
                )}
                <Row icon={<CreditCard className="w-4 h-4" />} label="Method" value={payment.method} />
                <Row icon={<Calendar className="w-4 h-4" />} label="Date" value={formatDate(payment.createdAt)} />
                {payment.updatedAt !== payment.createdAt && (
                  <Row icon={<Calendar className="w-4 h-4" />} label="Updated" value={formatDate(payment.updatedAt)} />
                )}
                {lotusMsg && (
                  <Row icon={<CheckCircle className="w-4 h-4" />} label="Gateway Message" value={String(lotusMsg)} />
                )}
              </div>
            </div>

            {/* Lotus raw data — collapsed */}
            {lotus && (
              <details className="group">
                <summary className="text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-600 transition">
                  Raw Gateway Response ▸
                </summary>
                <pre className="mt-2 bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto max-h-48">
                  {JSON.stringify(lotus, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-gray-500">{label}</span>
        <p className={`text-sm font-medium text-gray-800 break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}

// ─── Main Payments Page ───────────────────────────────────────────────────────

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Payment | null>(null);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: { status?: string; page?: number } = { page };
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await paymentsApi.list(params);
      setPayments(data.payments);
      setPagination(data.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-[#D4AF37]" />
            Payments
          </h1>
          {pagination && (
            <p className="text-gray-500 text-sm mt-0.5">
              {pagination.total} payment{pagination.total !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-600">Status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 ml-auto">Click any row to see full details</p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="px-5 py-3 flex gap-4 border-b border-gray-100 bg-gray-50">
            {['w-24', 'w-24', 'w-32', 'w-20', 'w-16', 'w-16', 'w-20', 'w-16', 'w-24'].map((w, i) => (
              <div key={i} className={`h-3 ${w} bg-gray-200 rounded`} />
            ))}
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex gap-4 border-b border-gray-50 items-center">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-5 w-20 bg-gray-100 rounded-full" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center">
          <p className="font-medium">{error}</p>
          <button onClick={loadPayments} className="mt-3 text-sm underline hover:no-underline">
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking Ref</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Installment</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      onClick={() => setSelected(payment)}
                      className="hover:bg-amber-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-5">
                        <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                          {payment.reference}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className="font-mono text-xs font-medium text-gray-700">
                          {payment.booking?.bookingRef ?? `#${payment.bookingId}`}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-medium text-gray-900">
                        {payment.booking?.customerName ?? '—'}
                      </td>
                      <td className="py-3 px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {payment.booking?.service ?? '—'}
                        </span>
                      </td>
                      <td className="py-3 px-5 font-semibold text-gray-900">
                        {formatAmount(payment.amount)}
                      </td>
                      <td className="py-3 px-5 text-gray-600 capitalize">{payment.method}</td>
                      <td className="py-3 px-5">
                        {payment.isInstallment ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-purple-100 text-purple-800 border-purple-200">
                            {payment.installmentNumber != null && payment.installmentTotal != null
                              ? `${payment.installmentNumber}/${payment.installmentTotal}`
                              : 'Yes'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-5">
                        <StatusBadge status={paymentStatusToLwa(payment.status)} type="lwa" />
                      </td>
                      <td className="py-3 px-5 text-gray-500 text-xs whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {payments.length === 0 && (
                <div className="text-center py-14">
                  <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No payments found</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
              <p className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selected && (
        <PaymentDetailModal payment={selected} onClose={() => setSelected(null)} />
      )}
    </motion.div>
  );
}
