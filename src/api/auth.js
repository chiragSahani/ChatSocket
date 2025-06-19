import api from './config';

export const authAPI = {
  login: async (username, password) => {
    return await api.post('/auth/login', { username, password });
  },

  register: async (username, password) => {
    return await api.post('/auth/register', { username, password });
  }
};