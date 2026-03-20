import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingScreen } from '../ui/Spinner';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard
    const dashboardMap = {
      youth: '/youth/dashboard',
      employer: '/employer/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }

  return children;
};

export default PrivateRoute;
