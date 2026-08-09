import { memo } from 'react';
import { formatPrice, formatDate } from '../utils/format';
import StatusBadge from './StatusBadge';

function OrderCard({ order, action }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Order #{String(order._id).slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {action}
        </div>
      </div>

      <div className="divide-y divide-slate-100 px-5">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-slate-700">
              <span className="font-semibold text-slate-900">{item.name}</span>
              <span className="ml-2 text-slate-400">x {item.quantity}</span>
            </span>
            <span className="font-medium text-slate-700">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        <span className="text-sm text-slate-500">
          {order.user ? `${order.user.name}${order.user.college ? ` - ${order.user.college}` : ''}` : ''}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>
    </article>
  );
}

export default memo(OrderCard);
