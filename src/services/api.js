/**
 * Instância centralizada do Axios para comunicação com o backend Laravel.
 *
 * Responsabilidades:
 * - Configurar a URL base da API e envio automático de credenciais (withCredentials: true)
 * - Permitir o tráfego do token Sanctum via Cookie HTTP-Only (protegido contra XSS)
 * - Detectar expiração de sessão (HTTP 401) e redirecionar ao login
 *
 * A escolha por uma instância única (singleton) em vez de múltiplas instâncias
 * por domínio é intencional: o backend é um monolito Laravel que serve a API REST,
 * portanto todos os endpoints compartilham a mesma base URL e o mesmo mecanismo de autenticação.
 */
import axios from "axios";

const api = axios.create({
  // Usa VITE_API_URL ou acompanha o hostname atual (localhost / 127.0.0.1 / IP da LAN)
  // para garantir que o Cookie HTTP-Only seja sempre same-site com o frontend.
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname || '127.0.0.1'}:8000/api/`,
  withCredentials: true,
  // O Content-Type application/json é omitido porque o Axios já o define
  // automaticamente ao detectar corpo JSON. Manter comentado evita duplicação
  // acidental do header em requisições multipart/form-data (upload de documentos).
  // headers: { 'Content-Type': 'application/json' },
});

/**
 * Interceptor de response: trata expiração de sessão (HTTP 401).
 *
 * O token de autenticação fica armazenado em um Cookie HTTP-Only gerenciado pelo
 * navegador (inacessível via JavaScript). Quando o backend retorna 401, limpamos
 * os dados locais do perfil do usuário e redirecionamos para a tela de login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
