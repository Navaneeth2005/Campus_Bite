import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/api';
import CartItem from '../components/CartItem';
import Button from '../components/UI/Button';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    if (cart.length === 0) return;

    setPlacing(true);
    setError('');
    try {
      const payload = cart.map((i) => ({ menuItem: i._id, quantity: i.quantity }));
      const order = await orderApi.create(payload);
      clearCart();
      navigate('/orders', { state: { placed: true, order } });
    } catch (err) {
      setError(err.message || 'Could not place the order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={'\u{1F6D2}'}
          title="Your cart is empty"
          subtitle="Add some delicious items from the menu to get started."
          action={
            <Link
              to="/menu"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
            >
              Browse Menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Your Cart</h1>
      <p className="mt-1 text-slate-500">{cart.length} item(s) in your cart</p>

      <ErrorMessage message={error} className="mt-4" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {cart.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <dt>Items</dt>
              <dd>{cart.reduce((s, i) => s + i.quantity, 0)}</dd>
            </div>
            <div className="flex justify-between text-slate-600">
              <dt>Delivery</dt>
              <dd className="font-medium text-green-600">Free</dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold text-slate-900">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button
            onClick={handleCheckout}
            fullWidth
            size="lg"
            loading={placing}
            className="mt-5"
          >
            {'\u2713'} Place Order
          </Button>
          <button
            onClick={clearCart}
            className="mt-3 w-full text-center text-sm font-medium text-slate-400 transition hover:text-red-500"
          >
            Clear cart
          </button>
        </aside>
      </div>
    </div>
  );
}
