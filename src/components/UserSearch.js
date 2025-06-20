import React, { useState, useEffect } from 'react';
import { privateAPI } from '../api/private';
import { useAuth } from '../contexts/AuthContext';
import Avatar from './Avatar';

function UserSearch({ onUserSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Mock user search - in a real app, you'd have a user search API
  const mockUsers = [
    { id: 1, username: 'alice' },
    { id: 2, username: 'bob' },
    { id: 3, username: 'charlie' },
    { id: 4, username: 'diana' },
    { id: 5, username: 'eve' },
    { id: 6, username: 'frank' },
    { id: 7, username: 'grace' },
    { id: 8, username: 'henry' },
    { id: 9, username: 'iris' },
    { id: 10, username: 'jack' },
  ].filter(u => u.id !== user?.id);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = mockUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filtered);
    } else {
      setUsers(mockUsers.slice(0, 5)); // Show first 5 users when no search
    }
  }, [searchTerm]);

  const handleStartConversation = async (selectedUser) => {
    try {
      setLoading(true);
      const conversation = await privateAPI.startConversation(selectedUser.id);
      onUserSelect(conversation);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-search-overlay">
      <div className="user-search-modal">
        <div className="user-search-header">
          <h3>Start New Conversation</h3>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="user-search-content">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoFocus
          />
          
          <div className="users-list">
            {users.length > 0 ? (
              users.map(u => (
                <div
                  key={u.id}
                  className={`user-item ${loading ? 'disabled' : ''}`}
                  onClick={() => !loading && handleStartConversation(u)}
                >
                  <Avatar username={u.username} size="sm" />
                  <span className="username">{u.username}</span>
                  {loading && <div className="loading-spinner"></div>}
                  }
                </div>
              ))
            ) : searchTerm ? (
              <div className="no-results">
                <p>No users found matching "{searchTerm}"</p>
                <small>Try a different search term</small>
              </div>
            ) : (
              <div className="search-hint">
                <p>Available users</p>
                <small>Click on a user to start a conversation</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSearch;