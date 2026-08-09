import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingSpinner';

// Guards routes that require a logged-in user.
// Optionally restricts to a specific role (e.g. admin).
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen label="Checking your session..." />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
