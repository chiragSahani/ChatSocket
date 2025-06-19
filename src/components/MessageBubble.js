import React from 'react';
import ReactMarkdown from 'react-markdown';
import Avatar from './Avatar';
import { formatTime } from '../utils/dateUtils';
import './MessageBubble.css';

function MessageBubble({ message, isOwn, showAvatar = true }) {
  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'} fade-in`}>
      {!isOwn && showAvatar && (
        <Avatar username={message.sender_username || 'User'} size="sm" />
      )}
      <div className="message-content">
        {!isOwn && (
          <div className="message-sender">
            {message.sender_username || 'Unknown User'}
          </div>
        )}
        <div className={`message-text ${isOwn ? 'own-text' : 'other-text'}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        <div className="message-time">
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;