const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middlewares');

// ดึงรายการหมวดหมู่ทั้งหมด (เฉพาะ Admin เท่านั้น)
router.get('/', isAdmin, (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่');
    } else {
      res.json(results);
    }
  });
});

// เพิ่มหมวดหมู่ใหม่ (เฉพาะ Admin เท่านั้น)
router.post('/', isAdmin, (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).send('กรุณากรอกชื่อหมวดหมู่ที่ไม่เป็นช่องว่าง');
  }

  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
    } else if (results.affectedRows === 0) {
      res.status(500).send('ไม่สามารถเพิ่มหมวดหมู่ได้');
    } else {
      res.status(201).json({ message: 'เพิ่มหมวดหมู่ใหม่สำเร็จ' });
    }
  });
});

// แก้ไขหมวดหมู่ (เฉพาะ Admin เท่านั้น)
router.put('/:id', isAdmin, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name || name.trim() === '') {
    return res.status(400).send('กรุณากรอกชื่อหมวดหมู่ที่ไม่เป็นช่องว่าง');
  }

  db.query('UPDATE categories SET name = ? WHERE category_id = ?', [name, id], (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่');
    } else if (results.affectedRows === 0) {
      res.status(404).send('ไม่พบหมวดหมู่ที่ต้องการแก้ไข');
    } else {
      res.send('แก้ไขหมวดหมู่เรียบร้อยแล้ว');
    }
  });
});

// ลบหมวดหมู่ (เฉพาะ Admin เท่านั้น)
router.delete('/:id', isAdmin, (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM categories WHERE category_id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send('เกิดข้อผิดพลาดในการลบหมวดหมู่');
    } else if (results.affectedRows === 0) {
      res.status(404).send('ไม่พบหมวดหมู่ที่ต้องการลบ');
    } else {
      res.send('ลบหมวดหมู่เรียบร้อยแล้ว');
    }
  });
});

module.exports = router;
