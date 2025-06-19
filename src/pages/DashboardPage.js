import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { roomsAPI } from '../api/rooms';
import { privateAPI } from '../api/private';
import Avatar from '../components/Avatar';
import './DashboardPage.css';

function DashboardPage() {
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { rooms, conversations, setRooms, setConversations, addRoom } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
    loadConversations();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsData = await roomsAPI.getAllRooms();
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const conversationsData = await privateAPI.getAllConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      const newRoom = await roomsAPI.createRoom(newRoomName.trim());
      addRoom(newRoom);
      setNewRoomName('');
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create room. Room name might already exist.');
    }
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  const handleJoinConversation = (conversationId) => {
    navigate(`/dm/${conversationId}`);
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Chat Dashboard</h1>
          <p>Welcome back, {user?.username}!</p>
        </div>
        <button onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Search</h2>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Public Rooms</h2>
            <button
              onClick={() => setShowCreateRoom(!showCreateRoom)}
              className="btn btn-primary btn-sm"
            >
              {showCreateRoom ? 'Cancel' : 'Create Room'}
            </button>
          </div>

          {showCreateRoom && (
            <form onSubmit={handleCreateRoom} className="create-room-form fade-in">
              <input
                type="text"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="form-input"
                autoFocus
              />
              <button type="submit" className="btn btn-success btn-sm">
                Create
              </button>
            </form>
          )}

          <div className="rooms-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <div
                  key={room.id}
                  className="room-card"
                  onClick={() => handleJoinRoom(room.id)}
                >
                  <div className="room-icon">
                    #
                  </div>
                  <div className="room-info">
                    <h3 className="room-name">{room.name}</h3>
                    <p className="room-meta">Public Room</p>
                  </div>
                  <div className="room-arrow">
                    →
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No rooms found</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn btn-secondary btn-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Private Conversations</h2>
          </div>

          <div className="conversations-list">
            {conversations.length > 0 ? (
              conversations.map(conversation => {
                const otherUserId = conversation.user1_id === user.id 
                  ? conversation.user2_id 
                  : conversation.user1_id;
                
                return (
                  <div
                    key={conversation.id}
                    className="conversation-item"
                    onClick={() => handleJoinConversation(conversation.id)}
                  >
                    <Avatar username={`User ${otherUserId}`} />
                    <div className="conversation-info">
                      <h4>User {otherUserId}</h4>
                      <p>Private conversation</p>
                    </div>
                    <div className="conversation-arrow">
                      →
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <p>No private conversations yet</p>
                <p className="empty-hint">Start chatting in rooms to begin private conversations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;