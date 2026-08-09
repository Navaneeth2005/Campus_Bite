import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { orderApi } from '../api/api';
import OrderCard from '../components/OrderCard';
import LoadingScreen from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const placedOrder = location.state?.placed;

  useEffect(() => {
    orderApi
      .getMine()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message || 'Could not load your orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen label="Loading your orders..." />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">My Orders</h1>
      <p className="mt-1 text-slate-500">Track the status of your deliveries</p>

      {placedOrder && (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {'\u2714'} Order placed successfully! Your food is on its way.
        </div>
      )}

      {error && <ErrorMessage message={error} className="mt-6" />}

      <div className="mt-8 space-y-5">
        {orders.length === 0 ? (
          <EmptyState
            icon={'\u{1F37D}'}
            title="No orders yet"
            subtitle="Place your first order and track it here."
            action={
              <Link
                to="/menu"
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                Browse Menu
              </Link>
            }
          />
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}
