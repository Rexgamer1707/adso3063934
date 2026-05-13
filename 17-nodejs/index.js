const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./database');
const auth = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

const characterRoutes = require('./routes/characters');  // ← renombrado
app.use('/api', characterRoutes);

const SECRET_KEY = 'your_secret';

// POST: /register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES(?, ?)`,
        [username, hashedPassword], (err) => {
            if (err) return res.status(400).json({ error: 'User already exists!' });
            res.json({ message: 'User Registered!' });
        });
});

// POST: /login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found!' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid password!' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful!', token });
    });
});

// GET: /characters
app.get('/characters', auth, (req, res) => {
    db.all(`SELECT * FROM characters`, [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));