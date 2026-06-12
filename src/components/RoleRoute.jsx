// Bloqueia acesso se o usuário autenticado não tiver o nível de acesso exigido pela rota.
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number[]} [props.allowedLevels=[1]] - Lista de níveis permitidos (padrão: apenas admin)
 */
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