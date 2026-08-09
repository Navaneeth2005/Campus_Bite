import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuApi } from '../api/api';
import MenuCard from '../components/MenuCard';
import SkeletonGrid from '../components/Skeleton';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { CATEGORY_OPTIONS } from '../utils/format';
import useDebounce from '../hooks/useDebounce';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedQuery = useDebounce(query, 350);

  const loadMenu = useCallback(async (q, cat) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (q.trim()) params.q = q.trim();
      if (cat) params.category = cat;
      const data = await menuApi.getAll(params);
      setItems(data.items);
    } catch (err) {
      setError(err.message || 'Failed to load the menu');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount / when category or debounced search changes
  useEffect(() => {
    loadMenu(debouncedQuery, category);
  }, [loadMenu, debouncedQuery, category]);

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (value) setSearchParams({ category: value });
    else setSearchParams({});
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Menu</h1>
        <p className="mt-1 text-slate-500">Fresh from the campus canteen, delivered to your dorm</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {'\u{1F50D}'}
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:w-56"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      {loading ? (
        <SkeletonGrid count={8} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={'\u{1F636}'}
          title="No items found"
          subtitle="Try a different search term or category."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
