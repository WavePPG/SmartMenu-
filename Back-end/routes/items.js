// routes/items.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // ฐานข้อมูลที่คุณกำหนด
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // กำหนดโฟลเดอร์ที่ใช้เก็บรูปภาพ
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// เพิ่มสินค้าใหม่
router.post('/add', upload.single('image'), (req, res) => {
  const { name, description, price, category_id, availability } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!name || !price || !category_id) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  db.query(
    'INSERT INTO items (name, description, price, category_id, image_url, availability) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category_id, imagePath, availability],
    (err, results) => {
      if (err) {
        return res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }
      res.status(201).send('เพิ่มสินค้าใหม่สำเร็จ');
    }
  );
});

// แก้ไขสินค้า
router.put('/edit/:item_id', upload.single('image'), (req, res) => {
  const { name, description, price, category_id, availability } = req.body;
  const { item_id } = req.params;
  const imagePath = req.file ? req.file.path : null;

  db.query(
    'UPDATE items SET name = ?, description = ?, price = ?, category_id = ?, image_url = IFNULL(?, image_url), availability = ? WHERE item_id = ?',
    [name, description, price, category_id, imagePath, availability, item_id],
    (err, results) => {
      if (err) {
        return res.status(500).send('เกิดข้อผิดพลาดในการแก้ไขสินค้า');
      }
      res.status(200).send('แก้ไขสินค้าสำเร็จ');
    }
  );
});

// ลบสินค้า
router.delete('/delete/:item_id', (req, res) => {
  const { item_id } = req.params;

  db.query('DELETE FROM items WHERE item_id = ?', [item_id], (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการลบสินค้า');
    }
    res.status(200).send('ลบสินค้าเรียบร้อยแล้ว');
  });
});

module.exports = router;
