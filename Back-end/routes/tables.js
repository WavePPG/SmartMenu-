// server/routes/tables.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middlewares');

// ดึงรายการโต๊ะทั้งหมด (เฉพาะ Admin เท่านั้น)
router.get('/', isAdmin, (req, res) => {
  db.query('SELECT * FROM tables', (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ');
    } else {
      res.json(results);
    }
  });
});

// เพิ่มโต๊ะใหม่ (เฉพาะ Admin เท่านั้น)
router.post('/', isAdmin, (req, res) => {
  const { table_number, qr_code } = req.body;

  db.query(
    'INSERT INTO tables (table_number, qr_code) VALUES (?, ?)',
    [table_number, qr_code],
    (err, results) => {
      if (err) {
        res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มโต๊ะ');
      } else {
        res.status(201).send('เพิ่มโต๊ะใหม่สำเร็จ');
      }
    }
  );
});

// แก้ไขโต๊ะ (เฉพาะ Admin เท่านั้น)
router.put('/:id', isAdmin, (req, res) => {
  const { table_number, qr_code } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE tables SET table_number = ?, qr_code = ? WHERE table_id = ?',
    [table_number, qr_code, id],
    (err, results) => {
      if (err) {
        res.status(500).send('เกิดข้อผิดพลาดในการแก้ไขโต๊ะ');
      } else {
        res.send('แก้ไขโต๊ะเรียบร้อยแล้ว');
      }
    }
  );
});

// ลบโต๊ะ (เฉพาะ Admin เท่านั้น)
router.delete('/:id', isAdmin, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM tables WHERE table_id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการลบโต๊ะ');
    } else {
      res.send('ลบโต๊ะเรียบร้อยแล้ว');
    }
  });
});

module.exports = router;
