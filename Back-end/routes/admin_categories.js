// routes/admin_categories.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middlewares');

// เพิ่มหมวดหมู่
router.post('/add', isAdmin, (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send('กรุณาระบุชื่อหมวดหมู่');
  }

  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
    }
    res.status(201).send('เพิ่มหมวดหมู่สำเร็จ');
  });
});

// แก้ไขหมวดหมู่
router.put('/edit/:category_id', isAdmin, (req, res) => {
  const { name } = req.body;
  const { category_id } = req.params;

  db.query('UPDATE categories SET name = ? WHERE category_id = ?', [name, category_id], (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่');
    }
    res.status(200).send('แก้ไขหมวดหมู่สำเร็จ');
  });
});

// ลบหมวดหมู่
router.delete('/delete/:category_id', isAdmin, (req, res) => {
  const { category_id } = req.params;

  db.query('DELETE FROM categories WHERE category_id = ?', [category_id], (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการลบหมวดหมู่');
    }
    res.status(200).send('ลบหมวดหมู่สำเร็จ');
  });
});

module.exports = router;
