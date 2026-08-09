// Centralized REST API service.
// Every network call in the app goes through this module so we have a single
// place that handles the base URL, auth headers, JSON parsing and errors.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TOKEN_KEY = 'campusbite_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch (err) {
    throw new Error('Unable to reach the server. Is the backend running?');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data;
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  del: (path) => request('DELETE', path)
};

// ---- Domain-specific helpers ------------------------------------------------

export const authApi = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  me: () => api.get('/api/auth/me'),
  updateProfile: (payload) => api.put('/api/auth/profile', payload),
  logout: () => api.post('/api/auth/logout')
};

export const menuApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, value);
    });
    const qs = query.toString();
    return api.get(`/api/menu${qs ? `?${qs}` : ''}`);
  },
  create: (payload) => api.post('/api/menu', payload),
  update: (id, payload) => api.put(`/api/menu/${id}`, payload),
  toggleAvailability: (id, available) => api.put(`/api/menu/${id}/availability`, { available }),
  remove: (id) => api.del(`/api/menu/${id}`)
};

export const orderApi = {
  create: (items) => api.post('/api/orders', { items }),
  getMine: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  getAll: (status) => api.get(`/api/orders/all${status ? `?status=${status}` : ''}`),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status })
};

export default api;
