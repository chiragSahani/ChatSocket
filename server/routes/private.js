const express = require('express');
const { createPrivateConversation, getAllConversationsForUser, getPrivateConversationByUsers } = require('../models/privateConversationModel');
const { sendMessage, getMessagesByConversation } = require('../models/messageModel');
const auth = require('../utils/authMiddleware');
const router = express.Router();

// Start or get a private conversation
router.post('/start', auth, (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ msg: 'Target user required' });
  createPrivateConversation(req.user.id, userId, (err, conversation) => {
    if (err) return res.status(500).json({ msg: 'Error creating conversation' });
    res.status(201).json(conversation);
  });
});

// Get all private conversations for the logged-in user
router.get('/', auth, (req, res) => {
  getAllConversationsForUser(req.user.id, (err, conversations) => {
    if (err) return res.status(500).json({ msg: 'Error fetching conversations' });
    res.json(conversations);
  });
});

// Get messages for a private conversation
router.get('/:conversationId/messages', auth, (req, res) => {
  getMessagesByConversation(req.params.conversationId, (err, messages) => {
    if (err) return res.status(500).json({ msg: 'Error fetching messages' });
    res.json(messages);
  });
});

// Send a message in a private conversation
router.post('/:conversationId/messages', auth, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ msg: 'Content required' });
  sendMessage({ conversationId: req.params.conversationId, senderId: req.user.id, content }, (err, message) => {
    if (err) return res.status(500).json({ msg: 'Error sending message' });
    res.status(201).json(message);
  });
});

module.exports = router; 