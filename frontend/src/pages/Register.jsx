import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import ErrorMessage from '../components/ErrorMessage';

const colleges = [
  'Mallareddy Engineering College',
  'CBIT',
  'JNTU Hyderabad',
  'Osmania University',
  'IIT Hyderabad'
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', college: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Name must be at least 2 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Enter a valid email';
    if (!form.college) er.college = 'Select your college';
    if (form.password.length < 6) er.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) er.confirmPassword = 'Passwords do not match';
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
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        college: form.college,
        password: form.password
      });
      navigate('/menu');
    } catch (err) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <span className="text-4xl">{'\u{1F374}'}</span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Join Campus Bite</h1>
          <p className="mt-1 text-sm text-slate-500">Order food from your campus canteens</p>
        </div>

        <ErrorMessage message={apiError} className="mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            id="name"
            label="Full Name"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
          />
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
          <div className="w-full">
            <label htmlFor="college" className="mb-1.5 block text-sm font-medium text-slate-700">
              College
            </label>
            <select
              id="college"
              name="college"
              value={form.college}
              onChange={handleChange}
              className={[
                'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:outline-none focus:ring-2',
                errors.college
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'
              ].join(' ')}
            >
              <option value="">Select your college</option>
              {colleges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.college && <p className="mt-1 text-xs text-red-600">{errors.college}</p>}
          </div>
          <Input
            id="password"
            label="Password"
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Repeat password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
          <Button type="submit" fullWidth size="lg" loading={submitting}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
