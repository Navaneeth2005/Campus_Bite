import { useCart } from '../context/CartContext';
import { formatPrice, FALLBACK_IMAGE } from '../utils/format';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
      <img
        src={item.image || FALLBACK_IMAGE}
        alt={item.name}
        loading="lazy"
        width="72"
        height="72"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
        className="h-18 w-18 shrink-0 rounded-lg object-cover"
        style={{ width: 72, height: 72 }}
      />

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-slate-900">{item.name}</h4>
        <p className="text-sm text-slate-500">
          {formatPrice(item.price)} each
        </p>
        <p className="mt-1 text-sm font-semibold text-brand-600">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100"
          aria-label="Decrease quantity"
        >
          {'\u2212'}
        </button>
        <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeFromCart(item._id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        aria-label={`Remove ${item.name}`}
      >
        {'\u{1F5D1}'}
      </button>
    </div>
  );
}
