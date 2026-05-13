const express = require('express');
const router = express.Router();
const upload = require('../upload');
const db = require('../database');
const auth = require('../authMiddleware');

// POST: /api/characters
router.post('/characters', auth, upload.single('image'), (req, res) => {
    const { name, magic_type, rank, house_id } = req.body;
    const image_url = req.file ? req.file.path : null;

    db.run(
        `INSERT INTO characters (name, magic_type, rank, image_url, house_id) VALUES (?, ?, ?, ?, ?)`,
        [name, magic_type, rank, image_url, house_id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({
                message: 'Character created!',
                id: this.lastID,
                name,
                magic_type,
                rank,
                image_url,
                house_id
            });
        }
    );
});


// POST: /api/houses
router.post('/houses', auth, (req, res) => {
    const { name, region, captain } = req.body;

    db.run(
        `INSERT INTO houses (name, region, captain) VALUES (?, ?, ?)`,
        [name, region, captain],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({
                message: 'House created!',
                id: this.lastID,
                name,
                region,
                captain
            });
        }
    );
});

// PUT: /api/houses/:id
router.put('/houses/:id', auth, (req, res) => {
    const { name, region, captain } = req.body;

    db.run(
        `UPDATE houses SET name = ?, region = ?, captain = ? WHERE id = ?`,
        [name, region, captain, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'House not found!' });
            res.json({ message: 'House updated!', id: req.params.id, name, region, captain });
        }
    );
});

// PUT: /api/characters/:id
router.put('/characters/:id', auth, upload.single('image'), (req, res) => {
    const { name, magic_type, rank, house_id } = req.body;
    const image_url = req.file ? req.file.path : null;

    db.run(
        `UPDATE characters SET name = ?, magic_type = ?, rank = ?, house_id = ?, image_url = COALESCE(?, image_url) WHERE id = ?`,
        [name, magic_type, rank, house_id, image_url, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Character not found!' });
            res.json({ message: 'Character updated!', id: req.params.id, name, magic_type, rank, house_id, image_url });
        }
    );
});

// GET: /api/houses
router.get('/houses', auth, (req, res) => {
    db.all(`SELECT * FROM houses`, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// GET: /api/houses/:id
router.get('/houses/:id', auth, (req, res) => {
    db.get(`SELECT * FROM houses WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'House not found!' });
        res.json(row);
    });
});

// GET: /api/characters
router.get('/characters', auth, (req, res) => {
    db.all(`
        SELECT characters.*, houses.name AS house_name 
        FROM characters 
        LEFT JOIN houses ON characters.house_id = houses.id
    `, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// GET: /api/characters/:id
router.get('/characters/:id', auth, (req, res) => {
    db.get(`
        SELECT characters.*, houses.name AS house_name 
        FROM characters 
        LEFT JOIN houses ON characters.house_id = houses.id
        WHERE characters.id = ?
    `, [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Character not found!' });
        res.json(row);
    });
});

// DELETE: /api/houses/:id
router.delete('/houses/:id', auth, (req, res) => {
    db.run(`DELETE FROM houses WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'House not found!' });
        res.json({ message: 'House deleted!' });
    });
});

// DELETE: /api/characters/:id
router.delete('/characters/:id', auth, (req, res) => {
    db.run(`DELETE FROM characters WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Character not found!' });
        res.json({ message: 'Character deleted!' });
    });
});

module.exports = router;