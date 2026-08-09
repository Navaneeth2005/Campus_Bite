import { ORDER_STATUS_META } from '../utils/format';

export default function StatusBadge({ status }) {
  const meta = ORDER_STATUS_META[status] || { label: status, classes: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.classes}`}>
      {meta.label}
    </span>
  );
}
