const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Missing fields" });

  findUserByUsername(username, async (err, user) => {
    if (user) return res.status(409).json({ msg: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    createUser(username, hashed, (err, newUser) => {
      if (err) return res.status(500).json({ msg: "Error creating user" });

      const token = jwt.sign({ id: newUser.id }, JWT_SECRET);
      res.status(201).json({ token, user: { id: newUser.id, username: newUser.username } });
    });
  });
});

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ msg: "Missing fields" });

  findUserByUsername(username, async (err, user) => {
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Incorrect password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.status(200).json({ token, user: { id: user.id, username: user.username } });
  });
});

module.exports = router;
