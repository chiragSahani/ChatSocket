import React from 'react';

function Avatar({ username, size = 'md', online = false, className = '' }) {
  const sizeClasses = {
    sm: 'avatar-sm',
    md: '',
    lg: 'avatar-lg'
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className={`avatar ${sizeClasses[size]} ${online ? 'status-indicator online' : ''} ${className}`}>
      {getInitials(username)}
    </div>
  );
}

export default Avatar;