const express = require('express');
const { sendMessage, getMessagesByRoom, getMessagesByConversation, editMessage, deleteMessage, getMessageById } = require('../models/messageModel');
const auth = require('../utils/authMiddleware');
const router = express.Router();

// Send a message to a room or private conversation
router.post('/', auth, (req, res) => {
  const { roomId, conversationId, content } = req.body;
  if (!content || (!roomId && !conversationId)) return res.status(400).json({ msg: 'Content and target required' });
  sendMessage({ roomId, conversationId, senderId: req.user.id, content }, (err, message) => {
    if (err) return res.status(500).json({ msg: 'Error sending message' });
    res.status(201).json(message);
  });
});

// Get messages by room
router.get('/room/:roomId', auth, (req, res) => {
  getMessagesByRoom(req.params.roomId, (err, messages) => {
    if (err) return res.status(500).json({ msg: 'Error fetching messages' });
    res.json(messages);
  });
});

// Get messages by private conversation
router.get('/conversation/:conversationId', auth, (req, res) => {
  getMessagesByConversation(req.params.conversationId, (err, messages) => {
    if (err) return res.status(500).json({ msg: 'Error fetching messages' });
    res.json(messages);
  });
});

// Edit a message
router.patch('/:id', auth, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ msg: 'Content required' });
  editMessage(req.params.id, content, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Error editing message' });
    res.json(result);
  });
});

// Delete a message
router.delete('/:id', auth, (req, res) => {
  deleteMessage(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ msg: 'Error deleting message' });
    res.json(result);
  });
});

// Get a message by ID
router.get('/:id', auth, (req, res) => {
  getMessageById(req.params.id, (err, message) => {
    if (err || !message) return res.status(404).json({ msg: 'Message not found' });
    res.json(message);
  });
});

module.exports = router; 