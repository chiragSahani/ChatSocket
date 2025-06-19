import React from 'react';
import './TypingIndicator.css';

function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  const displayText = users.length === 1 
    ? `${users[0]} is typing...`
    : users.length === 2
    ? `${users[0]} and ${users[1]} are typing...`
    : `${users[0]} and ${users.length - 1} others are typing...`;

  return (
    <div className="typing-indicator fade-in">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">{displayText}</span>
    </div>
  );
}

export default TypingIndicator;