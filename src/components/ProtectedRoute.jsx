// Redireciona ao login qualquer usuário não autenticado que tentar acessar uma rota protegida.
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}