interface StatusBadgeProps {
  status: string;
  type?: 'booking' | 'lwa';
}

const bookingColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
};

const lwaColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  suspended: 'bg-red-100 text-red-800 border-red-200',
};

export function StatusBadge({ status, type = 'booking' }: StatusBadgeProps) {
  const colorMap = type === 'lwa' ? lwaColors : bookingColors;
  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${colorClass}`}
    >
      {status}
    </span>
  );
}
