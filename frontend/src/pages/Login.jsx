import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import ErrorMessage from '../components/ErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const er = {};
    if (!form.email.trim()) er.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email';
    if (!form.password) er.password = 'Password is required';
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSubmitting(true);
    setApiError('');
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <span className="text-4xl">{'\u{1F44B}'}</span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to start ordering</p>
        </div>

        <ErrorMessage message={apiError} className="mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            name="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
