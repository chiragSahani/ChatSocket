import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useChat } from '../contexts/ChatContext';
import { messagesAPI } from '../api/messages';
import { roomsAPI } from '../api/rooms';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import Avatar from '../components/Avatar';
import './ChatPage.css';

function ChatPage() {
  const { roomId, conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinRoom, leaveRoom, sendMessage, typingUsers, onlineUsers } = useSocket();
  const { messages, addMessage, setMessages } = useChat();
  const [currentMessages, setCurrentMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const chatKey = roomId ? `room_${roomId}` : `conversation_${conversationId}`;

  useEffect(() => {
    if (roomId) {
      loadRoomData();
      joinRoom(roomId);
    } else if (conversationId) {
      loadConversationData();
    }

    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, conversationId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', handleNewMessage);
      return () => {
        socket.off('receive_message', handleNewMessage);
      };
    }
  }, [socket, chatKey]);

  useEffect(() => {
    const messagesForChat = messages[chatKey] || [];
    setCurrentMessages(messagesForChat);
  }, [messages, chatKey]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const loadRoomData = async () => {
    try {
      setLoading(true);
      const [roomData, messagesData] = await Promise.all([
        roomsAPI.getRoomById(roomId),
        messagesAPI.getMessagesByRoom(roomId)
      ]);
      
      setRoomInfo(roomData);
      setMessages(chatKey, messagesData);
    } catch (error) {
      console.error('Failed to load room data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationData = async () => {
    try {
      setLoading(true);
      const messagesData = await messagesAPI.getMessagesByConversation(conversationId);
      setMessages(chatKey, messagesData);
    } catch (error) {
      console.error('Failed to load conversation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    if (roomId && message.roomId == roomId) {
      addMessage(chatKey, {
        ...message,
        sender_id: message.senderId,
        room_id: message.roomId,
        created_at: message.createdAt
      });
    }
  };

  const handleSendMessage = async (content) => {
    try {
      if (roomId) {
        // For room messages, we rely on socket for real-time updates
        sendMessage(roomId, content);
      } else if (conversationId) {
        // For private messages, we use API and add to local state
        const newMessage = await messagesAPI.sendMessage(null, conversationId, content);
        addMessage(chatKey, {
          ...newMessage,
          sender_username: user.username
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getTypingUsers = () => {
    if (!roomId) return [];
    
    const now = Date.now();
    const activeTyping = [];
    
    typingUsers.forEach((timestamp, key) => {
      if (key.startsWith(`${roomId}_`) && now - timestamp < 3000) {
        const username = key.split('_')[1];
        if (username !== user.username) {
          activeTyping.push(username);
        }
      }
    });
    
    return activeTyping;
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button
          onClick={() => navigate('/dashboard')}
          className="back-button"
        >
          ← Back
        </button>
        <div className="chat-info">
          <h1 className="chat-title">
            {roomId ? `#${roomInfo?.name || 'Room'}` : 'Private Chat'}
          </h1>
          <p className="chat-subtitle">
            {roomId ? 'Public Room' : 'Private Conversation'}
          </p>
        </div>
        <div className="chat-actions">
          {roomId && (
            <div className="online-count">
              {onlineUsers.size} online
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        <div className="messages-container">
          {currentMessages.length > 0 ? (
            currentMessages.map((message, index) => {
              const isOwn = message.sender_id === user.id;
              const showAvatar = !isOwn && (
                index === 0 || 
                currentMessages[index - 1].sender_id !== message.sender_id
              );
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })
          ) : (
            <div className="empty-chat">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          
          <TypingIndicator users={getTypingUsers()} />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        roomId={roomId}
      />
    </div>
  );
}

export default ChatPage;