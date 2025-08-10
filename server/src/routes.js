// routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('./data.js');
const authMiddleware = require('./middleware/auth.js');

const JWT_SECRET = process.env.JWT_SECRET || 'REMWebSite22';


// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  console.log(`Login attempt with username: ${username}, password: ${password}`);

  if (username === 'admin' && password === '123456') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    console.log(`Login successful, token generated: ${token}`);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, token });
  }

  res.status(401).json({ error: 'Credenciais inválidas' });
});

// GET /items (proteção adicionada para teste de autenticação)
router.get('/items', authMiddleware, (req, res) => {
  res.json(db.getAll());
});

// POST /items
router.post('/items', (req, res) => {
  const { title, description } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });
  const it = db.create({ title, description });
  res.status(201).json(it);
});

// PUT /items/:id
router.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const title = req.body.title;

  const updated = db.update(id, title);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
});


router.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const ok = db.remove(id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.status(204).send();
});

module.exports = router;
