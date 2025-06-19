import api from './config';

export const messagesAPI = {
  sendMessage: async (roomId, conversationId, content) => {
    return await api.post('/messages', { roomId, conversationId, content });
  },

  getMessagesByRoom: async (roomId) => {
    return await api.get(`/messages/room/${roomId}`);
  },

  getMessagesByConversation: async (conversationId) => {
    return await api.get(`/messages/conversation/${conversationId}`);
  },

  editMessage: async (messageId, content) => {
    return await api.patch(`/messages/${messageId}`, { content });
  },

  deleteMessage: async (messageId) => {
    return await api.delete(`/messages/${messageId}`);
  }
};