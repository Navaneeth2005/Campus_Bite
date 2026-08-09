import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition',
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:text-brand-600'
  ].join(' ');

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg text-white">
            {'\u{1F374}'}
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            Campus <span className="text-brand-600">Bite</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            aria-label="Cart"
          >
            <span className="text-lg">{'\u{1F6D2}'}</span>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden lg:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-brand-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? '\u{2715}' : '\u{2630}'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/menu" className={navLinkClass} onClick={() => setOpen(false)}>
              Menu
            </NavLink>
            {user && (
              <NavLink to="/orders" className={navLinkClass} onClick={() => setOpen(false)}>
                Orders
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
                Admin
              </NavLink>
            )}
            <div className="mt-2 border-t border-slate-100 pt-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <NavLink to="/profile" className={navLinkClass} onClick={() => setOpen(false)}>
                    {user.name.split(' ')[0]}'s Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
