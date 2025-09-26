const express = require('express');
const db = require('../event_db');
const router = express.Router();
const conn = db.getconnection();
conn.connect();

router.get('/', (req, res, next) => {
  const { status = 'upcoming' } = req.query;

  const where = ['suspended = 0'];
  if (status === 'upcoming') {
    where.push('(end_datetime >= NOW())');
  } else {
    where.push('(end_datetime < NOW())');
  }

  const sql = `
    SELECT id, name, category_id, start_datetime, end_datetime,
           location_city, location_venue, image_url, ticket_price
    FROM events
    WHERE ${where.join(' AND ')}
    ORDER BY start_datetime ASC
  `;

  conn.execute(sql, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/search', (req, res, next) => {
  const { date_from, date_to, city, category_id } = req.query;

  const where = ['suspended = 0'];
  const params = [];

  if (date_from && date_to) {
    where.push('NOT ( end_datetime < ? OR start_datetime > ? )');
    params.push(date_from, date_to);
  } else if (date_from) {
    where.push('end_datetime >= ?');
    params.push(date_from);
  } else if (date_to) {
    where.push('start_datetime <= ?');
    params.push(date_to);
  }

  if (city) {
    where.push('location_city LIKE ?');
    params.push('%' + city + '%');
  }

  if (category_id) {
    where.push(`category_id = ?`);
    params.push(category_id);
  }

  const sql = `
    SELECT id, name, category_id, start_datetime, end_datetime,
           location_city, location_venue, image_url, ticket_price
    FROM events
    WHERE ${where.join(' AND ')}
    ORDER BY start_datetime ASC
  `;

  conn.execute(sql, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({
      data: null,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid id'
      }
    });
  }

  const sql = `
    SELECT id, category_id, name, short_description, description,
           start_datetime, end_datetime, location_city, location_venue, address_line,
           ticket_price, goal_amount, progress_amount, image_url, suspended
    FROM events
    WHERE id = ?
  `;

  conn.execute(sql, [id], (err, rows) => {
    if (err) return next(err);
    res.json({ data: rows[0], error: null });
  });
});

module.exports = router;
