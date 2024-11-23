// server/routes/items.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middlewares');

// ดึงรายการสินค้าทั้งหมด (ไม่ต้องเข้าสู่ระบบ)
router.get('/', (req, res) => {
  db.query('SELECT * FROM items WHERE availability = TRUE', (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    } else {
      res.json(results);
    }
  });
});

// เพิ่มสินค้าใหม่ (เฉพาะ Admin เท่านั้น)
router.post('/', isAdmin, (req, res) => {
  const { name, description, price, category_id, image_url, availability } = req.body;

  db.query(
    'INSERT INTO items (name, description, price, category_id, image_url, availability) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category_id, image_url, availability],
    (err, results) => {
      if (err) {
        res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      } else {
        res.status(201).send('เพิ่มสินค้าใหม่สำเร็จ');
      }
    }
  );
});

// แก้ไขสินค้า (เฉพาะ Admin เท่านั้น)
router.put('/:id', isAdmin, (req, res) => {
  const { name, description, price, category_id, image_url, availability } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE items SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, availability = ? WHERE item_id = ?',
    [name, description, price, category_id, image_url, availability, id],
    (err, results) => {
      if (err) {
        res.status(500).send('เกิดข้อผิดพลาดในการแก้ไขสินค้า');
      } else {
        res.send('แก้ไขสินค้าเรียบร้อยแล้ว');
      }
    }
  );
});

// ลบสินค้า (เฉพาะ Admin เท่านั้น)
router.delete('/:id', isAdmin, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM items WHERE item_id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการลบสินค้า');
    } else {
      res.send('ลบสินค้าเรียบร้อยแล้ว');
    }
  });
});

module.exports = router;
