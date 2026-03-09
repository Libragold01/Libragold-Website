import { Booking } from '../lib/api';
import { StatusBadge } from './StatusBadge';

interface BookingTableProps {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void;
  onStatusChange: (id: number, status: string) => void;
  updatingId?: number | null;
}

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function BookingTable({
  bookings,
  onRowClick,
  onStatusChange,
  updatingId,
}: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No bookings found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ref
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Email
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Phone
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Amount
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick(booking)}
            >
              <td className="py-3 px-4">
                <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                  {booking.bookingRef}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="font-medium text-gray-900 truncate max-w-[120px] block">
                  {booking.customerName}
                </span>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className="text-gray-600 truncate max-w-[160px] block">
                  {booking.email}
                </span>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="text-gray-600">{booking.phone}</span>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {booking.service}
                </span>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell">
                <span className="text-gray-700 font-medium">{booking.amount || '—'}</span>
              </td>
              <td
                className="py-3 px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  value={booking.status}
                  disabled={updatingId === booking.id}
                  onChange={(e) => onStatusChange(booking.id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:opacity-50 cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-4 hidden lg:table-cell">
                <span className="text-gray-500 text-xs">{formatDate(booking.createdAt)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
