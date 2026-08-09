import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-slate-500">
          {'\u00A9'} {new Date().getFullYear()} Campus Bite. Made for hungry students.
        </p>
        <div className="flex items-center gap-5 text-sm text-slate-500">
          <Link to="/menu" className="transition hover:text-brand-600">
            Menu
          </Link>
          <Link to="/orders" className="transition hover:text-brand-600">
            My Orders
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brand-600"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
