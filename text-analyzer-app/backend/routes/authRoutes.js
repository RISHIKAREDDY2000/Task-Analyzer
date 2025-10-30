const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { SECRET_KEY } = require('../middleware/auth');

// Load data.json
const dataPath = path.join(__dirname, '../data/data.json');

const loadData = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      message: 'Username and password are required' 
    });
  }

  const data = loadData();
  const user = data.users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Simple password comparison (in production, use bcrypt)
  if (user.password !== password) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    SECRET_KEY,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    message: 'Login successful',
    token: token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

module.exports = router;