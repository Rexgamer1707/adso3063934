const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./blackcloverdb.sqlite');

db.serialize(() => {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // Houses Table
    db.run(`CREATE TABLE IF NOT EXISTS houses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        region TEXT,
        captain TEXT
    )`);

    // Characters Table
    db.run(`CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        magic_type TEXT,
        rank TEXT,
        image_url TEXT,
        house_id INTEGER,
        FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE SET NULL
    )`);
});

module.exports = db;