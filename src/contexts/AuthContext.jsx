/**
 * Contexto global de autenticação — estrategicamente posicionado como o nó raiz
 * da árvore React (RootLayout em main.jsx) para que toda a aplicação tenha
 * acesso ao estado de autenticação sem prop drilling.
 *
 * Decisão arquitetural: a sessão é armazenada em localStorage (não sessionStorage,
 * não cookies) porque o sistema é acessado exclusivamente em rede interna (LAN),
 * sem exposição à internet. A persistência cross-tab é desejada para que o servidor
 * não precise reautenticar ao abrir uma nova aba durante o expediente.
 */
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * Provedor de autenticação.
 *
 * Gerencia o ciclo completo de sessão: login, registro e logout.
 * A inicialização dos estados user e token é feita via lazy initializer
 * (função passada a useState) para ler o localStorage apenas uma vez
 * na montagem do componente, evitando leituras repetidas a cada render.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Subárvore de componentes que terão acesso ao contexto
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser]   = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  /**
   * Persiste a sessão simultaneamente no localStorage e no estado React.
   *
   * A dupla persistência (storage + estado) é necessária porque o interceptor
   * Axios lê diretamente do localStorage (fora da árvore React), enquanto os
   * componentes consomem o estado via Context API. Ambas as fontes precisam
   * ser atualizadas atomicamente para evitar race conditions entre UI e rede.
   */
  const saveSession = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const register = async (name, name_user, password, password_confirmation) => {
    const { data } = await api.post('register', {
      name, name_user, password, password_confirmation,
    });
    saveSession(data.user, data.token);
    navigate('/');
  };

  const login = async (name_user, password) => {
    const { data } = await api.post('login', { name_user, password });
    saveSession(data.user, data.token);
    navigate('/');
  };

  /**
   * Encerra a sessão do usuário.
   *
   * O bloco try/finally garante que a limpeza local (localStorage + estado)
   * ocorra MESMO se o backend estiver indisponível no momento do logout.
   * Isso evita que o usuário fique preso em uma tela autenticada com token
   * inválido após tentar sair. O custo é que o token permanece válido no
   * servidor até sua expiração natural — risco aceitável em LAN interna.
   */
  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      /**
       * isAuthenticated deriva exclusivamente da presença do token.
       * Não verifica expiração ou validade — essa responsabilidade
       * é do backend (HTTP 401) tratado pelo interceptor Axios.
       */
      isAuthenticated: !!token,
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
 * Centraliza a chamada useContext + AuthContext em um único ponto,
 * facilitando eventual refatoração futura (ex: trocar Context API por Zustand)
 * sem alterar todos os componentes consumidores.
 *
 * @returns {Object} Estado e funções de autenticação
 */
export const useAuth = () => useContext(AuthContext);
