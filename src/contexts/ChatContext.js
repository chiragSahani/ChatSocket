import React, { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext();

const initialState = {
  rooms: [],
  conversations: [],
  messages: {},
  currentRoom: null,
  currentConversation: null,
  loading: false,
  error: null
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.key]: action.payload.messages
        }
      };
    case 'ADD_MESSAGE':
      const { key, message } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [key]: [...(state.messages[key] || []), message]
        }
      };
    case 'SET_CURRENT_ROOM':
      return { ...state, currentRoom: action.payload, currentConversation: null };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload, currentRoom: null };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setRooms = (rooms) => {
    dispatch({ type: 'SET_ROOMS', payload: rooms });
  };

  const addRoom = (room) => {
    dispatch({ type: 'ADD_ROOM', payload: room });
  };

  const setConversations = (conversations) => {
    dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
  };

  const addConversation = (conversation) => {
    dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
  };

  const setMessages = (key, messages) => {
    dispatch({ type: 'SET_MESSAGES', payload: { key, messages } });
  };

  const addMessage = (key, message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { key, message } });
  };

  const setCurrentRoom = (room) => {
    dispatch({ type: 'SET_CURRENT_ROOM', payload: room });
  };

  const setCurrentConversation = (conversation) => {
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setRooms,
    addRoom,
    setConversations,
    addConversation,
    setMessages,
    addMessage,
    setCurrentRoom,
    setCurrentConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}