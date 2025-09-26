const express = require('express');
const db = require('../database');
const router = express.Router();
const conn = db.getconnection();
conn.connect();

router.get('/', (req, res) => {
  conn.query('SELECT * FROM Concert', (err, rows) => {
    if (err) return res.status(500).send({ error: 'query failed' });
    res.send(rows);
  });
});

router.get('/:id', (req, res) => {
  conn.query('SELECT * FROM Concert WHERE ConcertID = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).send({ error: 'query failed' });
    res.send(rows);
  });
});

router.post('/', (req, res) => {
  const { ConcertID, ArtistName, Location } = req.body;
  conn.query('INSERT INTO Concert VALUES (?, ?, ?)', [ConcertID, ArtistName, Location], (err) => {
    if (err) return res.status(500).send({ insert: 'fail' });
    res.send({ insert: 'success' });
  });
});

router.put('/', (req, res) => {
  const { ConcertID, Location } = req.body;
  conn.query('UPDATE Concert SET Location = ? WHERE ConcertID = ?', [Location, ConcertID], (err) => {
    if (err) return res.status(500).send({ update: 'fail' });
    res.send({ update: 'success' });
  });
});

router.delete('/:id', (req, res) => {
  conn.query('DELETE FROM Concert WHERE ConcertID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send({ delete: 'fail' });
    res.send({ delete: 'success' });
  });
});

module.exports = router;
