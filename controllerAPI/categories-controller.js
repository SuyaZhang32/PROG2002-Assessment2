const express = require('express');
const router = express.Router();
const db = require('../event_db.js');

const conn = db.getconnection();
conn.connect();

router.get('/', (req, res, next) => {
  const conn = db.getconnection();
  conn.query('SELECT id, name FROM categories ORDER BY name ASC', (err, rows) => {
    conn.end();
    if (err) return next(err);
    res.json(rows);
  });
});

module.exports = router;
