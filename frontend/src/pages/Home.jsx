import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const categories = [
  { slug: 'south-indian', label: 'South Indian', emoji: '\u{1F965}' },
  { slug: 'north-indian', label: 'North Indian', emoji: '\u{1F957}' },
  { slug: 'chinese', label: 'Chinese', emoji: '\u{1F35C}' },
  { slug: 'continental', label: 'Continental', emoji: '\u{1F35D}' },
  { slug: 'desserts', label: 'Desserts', emoji: '\u{1F36A}' },
  { slug: 'beverages', label: 'Beverages', emoji: '\u{2615}' },
  { slug: 'bakers', label: 'Bakery', emoji: '\u{1F35E}' },
  { slug: 'japanese', label: 'Japanese', emoji: '\u{1F961}' }
];

const features = [
  {
    emoji: '\u{26A1}',
    title: 'Lightning Fast',
    text: 'Food from campus canteens delivered to your dorm in 15-20 minutes.'
  },
  {
    emoji: '\u{1F4F1}',
    title: 'Easy Ordering',
    text: 'Browse the menu, add to cart and check out in a few taps.'
  },
  {
    emoji: '\u{1F4C8}',
    title: 'Track Your Order',
    text: 'Live order status from pending to preparing to delivered.'
  }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 via-brand-500 to-accent-600 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              {user ? (
                <>
                  Welcome back, <span className="text-amber-300">{user.name.split(' ')[0]}</span>!
                </>
              ) : (
                'Why wait in line when food can find you?'
              )}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/85">
              Get delicious meals from your campus canteens delivered straight to your dorm room.
              Pick a category, add your favorites and checkout in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="rounded-xl bg-amber-400 px-6 py-3 font-bold text-slate-900 transition hover:bg-amber-300"
              >
                {'\u{1F680}'} Order Now
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Create an Account
                </Link>
              )}
            </div>
            <dl className="mt-10 flex flex-wrap gap-8">
              {[
                ['10K+', 'Happy Students'],
                ['50+', 'Campus Canteens'],
                ['15 min', 'Avg Delivery']
              ].map(([num, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-extrabold text-amber-300">{num}</dt>
                  <dd className="text-sm text-white/80">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hidden place-items-center lg:grid">
            <div className="grid grid-cols-3 gap-4 text-6xl">
              <span className="animate-bounce">{'\u{1F355}'}</span>
              <span className="animate-bounce [animation-delay:150ms]">{'\u{1F354}'}</span>
              <span className="animate-bounce [animation-delay:300ms]">{'\u{1F32E}'}</span>
              <span className="animate-bounce [animation-delay:450ms]">{'\u{1F35C}'}</span>
              <span className="animate-bounce [animation-delay:600ms]">{'\u{1F95E}'}</span>
              <span className="animate-bounce [animation-delay:750ms]">{'\u{1F36B}'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">Explore the Menu</h2>
          <p className="mt-2 text-slate-500">From comfort food to gourmet delights</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/menu?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="text-4xl transition group-hover:scale-110">{cat.emoji}</span>
              <span className="font-semibold text-slate-800">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-cream py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
              <span className="text-4xl">{f.emoji}</span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
