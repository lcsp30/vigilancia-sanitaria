/**
 * Contexto global de autenticação — estrategicamente posicionado como o nó raiz
 * da árvore React (RootLayout em main.jsx) para que toda a aplicação tenha
 * acesso ao estado de autenticação sem prop drilling.
 *
 * Decisão de segurança: o token de acesso (Laravel Sanctum) é armazenado exclusivamente
 * em um Cookie HTTP-Only (`auth_token`) gerenciado pelo backend/navegador, inacessível
 * via JavaScript (proteção contra roubo de token via XSS). No localStorage mantemos
 * apenas os dados básicos de exibição/perfil (`user`) para restauração imediata da UI
 * entre abas, validados contra o endpoint `/api/me`.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Provedor de autenticação.
 *
 * Gerencia o ciclo completo de sessão: login, registro, validação de sessão e logout.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Subárvore de componentes que terão acesso ao contexto
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    // Limpa eventual token legado que tenha ficado salvo em versões anteriores
    localStorage.removeItem('token');
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  /**
   * Salva os dados públicos do usuário no estado React e no localStorage.
   * O token de autenticação NÃO passa pelo JavaScript — ele é definido pelo
   * backend via header Set-Cookie (HttpOnly).
   */
  const saveSession = (userData) => {
    localStorage.removeItem('token');
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Sincroniza/valida a sessão com o cookie HTTP-Only ao montar a aplicação
  useEffect(() => {
    if (!user) return;
    api.get('me')
      .then(({ data }) => {
        if (data?.user) {
          saveSession(data.user);
        }
      })
      .catch(() => {
        localStorage.removeItem('user');
        setUser(null);
      });
  }, []);

  const register = async (name, name_user, password, password_confirmation) => {
    const { data } = await api.post('register', {
      name, name_user, password, password_confirmation,
    });
    saveSession(data.user);
    navigate('/');
  };

  const login = async (name_user, password) => {
    const { data } = await api.post('login', { name_user, password });
    saveSession(data.user);
    navigate('/');
  };

  /**
   * Encerra a sessão do usuário.
   *
   * O backend revoga o token no banco de dados e expira o Cookie HTTP-Only (`auth_token`).
   * O bloco try/finally garante que o estado local seja limpo mesmo se a rede falhar.
   */
  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook de conveniência para acessar o contexto de autenticação.
 *
 * @returns {Object} Estado e funções de autenticação
 */
export const useAuth = () => useContext(AuthContext);
