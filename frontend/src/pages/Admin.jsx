import { useCallback, useEffect, useState } from 'react';
import { menuApi, orderApi } from '../api/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import ErrorMessage from '../components/ErrorMessage';
import LoadingScreen from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { formatPrice, CATEGORY_OPTIONS } from '../utils/format';

const ORDER_STATUSES = ['pending', 'preparing', 'delivered', 'cancelled'];
const EMPTY_FORM = { name: '', price: '', category: '', description: '', image: '' };

export default function Admin() {
  const [tab, setTab] = useState('menu');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-slate-500">Manage the menu and incoming orders</p>

      <div className="mt-6 flex gap-2">
        {[
          ['menu', 'Menu Items'],
          ['orders', 'Orders']
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'rounded-lg px-4 py-2 text-sm font-semibold transition',
              tab === key ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            ].join(' ')}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === 'menu' ? <MenuManager /> : <OrdersManager />}</div>
    </div>
  );
}

/* ---------------------------- Menu management ---------------------------- */

function MenuManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await menuApi.getAll({ available: 'all' });
      setItems(data.items);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await menuApi.create({
        name: form.name,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        image: form.image
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message || 'Could not add item');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    try {
      await menuApi.toggleAvailability(item._id, !item.available);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await menuApi.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingScreen label="Loading menu..." />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">{items.length} items</p>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close' : '+ Add Item'}
        </Button>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:grid-cols-2">
          <Input id="f-name" label="Name" name="name" value={form.name} onChange={handleChange} required />
          <Input
            id="f-price"
            label="Price (Rs)"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            required
          />
          <div className="w-full">
            <label htmlFor="f-category" className="mb-1.5 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="f-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.filter((c) => c.value).map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <Input id="f-image" label="Image URL" name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          <div className="sm:col-span-2">
            <Input id="f-desc" label="Description" name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" loading={saving}>
              Save Item
            </Button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <EmptyState title="No menu items" subtitle="Add your first menu item." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 px-4 py-3">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width="56"
                  height="56"
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs capitalize text-slate-500">
                    {item.category} {'\u00B7'} {formatPrice(item.price)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
                <button
                  onClick={() => handleToggle(item)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {item.available ? 'Mark unavailable' : 'Mark available'}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------- Orders management --------------------------- */

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async (status) => {
    setLoading(true);
    setError('');
    try {
      const data = await orderApi.getAll(status);
      setOrders(data.orders);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(statusFilter);
  }, [load, statusFilter]);

  const handleStatus = async (id, status) => {
    try {
      await orderApi.updateStatus(id, status);
      await load(statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingScreen label="Loading orders..." />;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{orders.length} orders</p>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      {orders.length === 0 ? (
        <EmptyState title="No orders found" subtitle="Orders placed by students will appear here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    Order #{String(order._id).slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.user ? `${order.user.name} - ${order.user.college || ''}` : 'Student'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatus(order._id, e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {order.items.map((item, i) => (
                  <span key={i} className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                    {item.name} x {item.quantity}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex justify-end text-sm font-bold text-slate-900">
                Total: {formatPrice(order.totalAmount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
