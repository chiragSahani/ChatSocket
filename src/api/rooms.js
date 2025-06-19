import api from './config';

export const roomsAPI = {
  getAllRooms: async () => {
    return await api.get('/rooms');
  },

  createRoom: async (name) => {
    return await api.post('/rooms', { name });
  },

  getRoomById: async (id) => {
    return await api.get(`/rooms/${id}`);
  }
};