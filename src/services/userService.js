import api from './api';

/**
 * Serviço de CRUD de usuários — utilizado exclusivamente pelo painel admin.
 *
 * Todas as funções utilizam a instância centralizada de Axios (api.js),
 * que automaticamente injeta o token JWT e trata expiração de sessão.
 *
 * @namespace userService
 */
export const userService = {
  /**
   * Retorna a lista completa de usuários do sistema.
   *
   * O fallback `response.data.data || response.data` existe porque o backend
   * Laravel pode envelopar a resposta de duas formas distintas dependendo do
   * recurso: com wrapper { data: [...] } (padrão Laravel Resource Collection)
   * ou com o array diretamente na raiz. Este fallback garante compatibilidade
   * com ambas as estruturas sem exigir alteração no backend.
   *
   * @returns {Promise<Array<Object>>} Lista de objetos de usuário
   */
  getUsers: async () => {
    const response = await api.get('user');
    const usuarios = response.data.data || response.data;
    // FIXME: Remover console.log antes de ir para produção.
    // Útil apenas para depuração durante o desenvolvimento.
    console.log(usuarios);
    return usuarios;
  },

  /**
   * Cria um novo usuário no sistema.
   *
   * @param {Object} userData - Dados do novo usuário (name, name_user, password, password_confirmation, nivel_acesso)
   * @returns {Promise<Object>} Resposta do backend com os dados do usuário criado
   */
  createUser: async (userData) => {
    const { data } = await api.post('user', userData);
    return data;
  },

  /**
   * Atualiza os dados de um usuário existente.
   *
   * @param {number|string} id - Identificador do usuário
   * @param {Object} userData - Campos a serem atualizados
   * @returns {Promise<Object>} Resposta do backend
   */
  updateUser: async (id, userData) => {
    const { data } = await api.put(`user/${id}`, userData);
    return data;
  },

  /**
   * Remove um usuário do sistema.
   *
   * @param {number|string} id - Identificador do usuário a ser removido
   * @returns {Promise<Object>} Resposta do backend
   */
  deleteUser: async (id) => {
    const { data } = await api.delete(`user/${id}`);
    return data;
  },
};
