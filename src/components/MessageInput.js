import React, { useState, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import './MessageInput.css';

function MessageInput({ onSendMessage, roomId, placeholder = "Type a message... (Markdown supported)" }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendTyping } = useSocket();
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Only send typing indicator for public rooms
    if (!isTyping && roomId) {
      setIsTyping(true);
      sendTyping(roomId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <div className="message-input-container">
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="message-input"
          rows="1"
          maxLength="1000"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="send-button"
          title="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
          </svg>
        </button>
      </div>
      <div className="message-input-hint">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
}

export default MessageInput;