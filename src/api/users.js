import api from './config';

export const usersAPI = {
  searchUsers: async (query) => {
    return await api.get(`/users/search?q=${encodeURIComponent(query)}`);
  },

  getUserById: async (userId) => {
    return await api.get(`/users/${userId}`);
  },

  getAllUsers: async () => {
    return await api.get('/users');
  }
};