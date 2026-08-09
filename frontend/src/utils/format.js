// Currency formatting for Indian Rupees (no decimals for whole amounts).
export const formatPrice = (value) => {
  const num = Number(value) || 0;
  return `\u20B9${num.toLocaleString('en-IN')}`;
};

// Human friendly date, e.g. "9 Aug 2026, 3:45 pm"
export const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'bakers', label: 'Bakery' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'juices', label: 'Fresh Juices' },
  { value: 'continental', label: 'Continental' },
  { value: 'north-indian', label: 'North Indian' },
  { value: 'south-indian', label: 'South Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'other', label: 'World Cuisine' }
];

export const ORDER_STATUS_META = {
  pending: { label: 'Pending', classes: 'bg-amber-100 text-amber-700' },
  preparing: { label: 'Preparing', classes: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', classes: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-600' }
};

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
