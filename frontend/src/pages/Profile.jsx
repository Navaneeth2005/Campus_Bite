import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import ErrorMessage from '../components/ErrorMessage';
import { formatDate } from '../utils/format';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({ name: user.name, college: user.college });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const data = await authApi.updateProfile({
        name: form.name.trim(),
        college: form.college.trim()
      });
      updateUser(data.user);
      setForm({ name: data.user.name, college: data.user.college });
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Profile</h1>
      <p className="mt-1 text-slate-500">Manage your account details</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500 text-xl font-extrabold text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-lg font-bold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <dl className="mb-6 grid gap-4 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="mt-0.5 font-semibold capitalize text-slate-900">{user.role}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Member since</dt>
            <dd className="mt-0.5 font-semibold text-slate-900">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>

        <ErrorMessage message={error} className="mb-4" />
        {saved && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {'\u2714'} Profile updated successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            id="college"
            label="College"
            name="college"
            value={form.college}
            onChange={handleChange}
          />
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
