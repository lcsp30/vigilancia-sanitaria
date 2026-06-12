/**
 * Instância centralizada do Axios para comunicação com o backend Laravel.
 *
 * Responsabilidades:
 * - Configurar a URL base da API
 * - Injetar token JWT em toda requisição (estratégia stateless)
 * - Detectar expiração de sessão (HTTP 401) e redirecionar ao login
 *
 * A escolha por uma instância única (singleton) em vez de múltiplas instâncias
 * por domínio é intencional: o backend é um monolito Laravel que serve tanto
 * a API REST quanto os arquivos estáticos do frontend, portanto todos os
 * endpoints compartilham a mesma base URL e o mesmo mecanismo de autenticação.
 */
import axios from "axios";

const api = axios.create({
  // TODO: Mover para variável de ambiente (VITE_API_URL).
  // A URL está hardcoded porque o sistema opera exclusivamente em LAN interna
  // e nunca foi necessário apontar para ambientes diferentes.
  // Se houver implantação em múltiplos ambientes (homologação/produção),
  // substituir por import.meta.env.VITE_API_URL.
  baseURL: "http://10.11.10.75:8000/api/",
  // O Content-Type application/json é omitido porque o Axios já o define
  // automaticamente ao detectar corpo JSON. Manter comentado evita duplicação
  // acidental do header em requisições multipart/form-data (upload de documentos).
  // headers: { 'Content-Type': 'application/json' },
});

/**
 * Interceptor de request: injeta o token JWT automaticamente.
 *
 * A leitura direta de localStorage é uma escolha pragmática para uma equipe
 * de 2 pessoas: evita a complexidade de propagar o token via props/context
 * em cada chamada de serviço. O AuthContext já mantém o token em memória,
 * mas o interceptor garante que mesmo chamadas feitas fora da árvore React
 * (ex: redirecionamento forçado por 401) estejam autenticadas.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Interceptor de response: trata expiração de sessão (HTTP 401).
 *
 * Usa window.location.href em vez do navigate() do React Router porque este
 * interceptor é executado fora da árvore de componentes React — não tem acesso
 * a hooks. O recarregamento completo da página garante que o estado global
 * (AuthContext, Router) seja completamente resetado para o estado inicial de
 * login, eliminando qualquer stale state.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
