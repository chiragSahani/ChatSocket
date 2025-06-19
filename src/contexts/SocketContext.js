import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Map());
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const newSocket = io('https://chatsocket-2-ufd3.onrender.com', {
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join_server', { userId: user.id });
      });

      newSocket.on('user_status_update', ({ userId, status }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          if (status === 'online') {
            newSet.add(userId);
          } else {
            newSet.delete(userId);
          }
          return newSet;
        });
      });

      newSocket.on('user_typing', ({ username, roomId }) => {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          const key = `${roomId}_${username}`;
          newMap.set(key, Date.now());
          return newMap;
        });

        // Clear typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers(prev => {
            const newMap = new Map(prev);
            const key = `${roomId}_${username}`;
            newMap.delete(key);
            return newMap;
          });
        }, 3000);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join_room', { roomId });
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave_room', { roomId });
    }
  };

  const sendMessage = (roomId, content) => {
    if (socket && user) {
      socket.emit('send_message', {
        roomId,
        senderId: user.id,
        content
      });
    }
  };

  const sendTyping = (roomId) => {
    if (socket && user) {
      socket.emit('typing', {
        roomId,
        username: user.username
      });
    }
  };

  const value = {
    socket,
    onlineUsers,
    typingUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}