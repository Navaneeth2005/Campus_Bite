import { memo } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, FALLBACK_IMAGE } from '../utils/format';

function MenuCard({ item }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={item.image || FALLBACK_IMAGE}
          alt={item.name}
          loading="lazy"
          width="400"
          height="300"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {!item.available && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900">{item.name}</h3>
          <span className="whitespace-nowrap text-lg font-extrabold text-brand-600">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description}</p>
        )}
        <span className="mt-2 self-start rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-600">
          {item.category}
        </span>

        <div className="mt-auto pt-4">
          <button
            onClick={() => addToCart(item)}
            disabled={!item.available}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {item.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(MenuCard);
