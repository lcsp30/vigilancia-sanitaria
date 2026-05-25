import api from './api';

export const userService = {
  getUsers: async () => {
    const { data } = await api.get('user');
    console.log(data);
    return data;
  },

  createUser: async (userData) => {
    const { data } = await api.post('/users', userData);
    return data;
  },

  updateUser: async (id, userData) => {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
};
