const express = require('express');
const { createRoom, getAllRooms, getRoomById } = require('../models/roomModel');
const auth = require('../utils/authMiddleware');
const router = express.Router();

// Create a new room
router.post('/', auth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Room name required' });
  createRoom(name, req.user.id, (err, room) => {
    if (err) return res.status(400).json({ msg: 'Room exists or error', error: err.message });
    res.status(201).json(room);
  });
});

// List all rooms
router.get('/', auth, (req, res) => {
  getAllRooms((err, rooms) => {
    if (err) return res.status(500).json({ msg: 'Error fetching rooms' });
    res.json(rooms);
  });
});

// Get a room by ID
router.get('/:id', auth, (req, res) => {
  getRoomById(req.params.id, (err, room) => {
    if (err || !room) return res.status(404).json({ msg: 'Room not found' });
    res.json(room);
  });
});

module.exports = router; 