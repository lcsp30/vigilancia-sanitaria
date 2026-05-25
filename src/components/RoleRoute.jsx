import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function RoleRoute({ children, allowedLevels = [1] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedLevels.includes(user?.nivel_acesso)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
