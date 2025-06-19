import api from './config';

export const privateAPI = {
  startConversation: async (userId) => {
    return await api.post('/private/start', { userId });
  },

  getAllConversations: async () => {
    return await api.get('/private');
  },

  getConversationMessages: async (conversationId) => {
    return await api.get(`/private/${conversationId}/messages`);
  },

  sendMessage: async (conversationId, content) => {
    return await api.post(`/private/${conversationId}/messages`, { content });
  }
};