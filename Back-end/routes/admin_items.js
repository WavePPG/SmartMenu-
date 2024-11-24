// routes/adminItems.js

const express = require('express');
const router = express.Router();
const db = require('../db'); // ตรวจสอบให้แน่ใจว่าไฟล์ db.js ของคุณถูกต้อง
const { isAdmin } = require('../middlewares'); // ตรวจสอบ Middleware สำหรับการยืนยันสิทธิ์ผู้ดูแล
const multer = require('multer');
const path = require('path');

// ตั้งค่า multer สำหรับการอัพโหลดไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // กำหนดโฟลเดอร์ที่ใช้เก็บรูปภาพ
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// **GET** route สำหรับดึงรายการสินค้า
router.get('/', isAdmin, (req, res) => {
  const query = `
    SELECT items.*, categories.name AS category_name 
    FROM items 
    JOIN categories ON items.category_id = categories.category_id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).send('Error fetching items');
    }
    res.json(results);
  });
});

// **GET** route สำหรับดึงหมวดหมู่สินค้า
router.get('/categories', isAdmin, (req, res) => {
  const query = 'SELECT * FROM categories';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).send('Error fetching categories');
    }
    res.json(results);
  });
});

// **POST** route สำหรับเพิ่มสินค้าใหม่
router.post('/add', isAdmin, upload.single('image'), (req, res) => {
  let { name, description, price, category_id, availability } = req.body;
  const imagePath = req.file ? req.file.path : null;

  // แปลงประเภทข้อมูล
  price = parseFloat(price);
  category_id = parseInt(category_id, 10);
  availability = availability === 'true' || availability === true ? 1 : 0;

  if (!name || !price || !category_id) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const query = `
    INSERT INTO items (name, description, price, category_id, image_url, availability) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, description, price, category_id, imagePath, availability],
    (err, results) => {
      if (err) {
        console.error('Error adding item:', err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มสินค้า' });
      }
      res.status(201).json({ message: 'เพิ่มสินค้าใหม่สำเร็จ' });
    }
  );
});

// **PUT** route สำหรับแก้ไขสินค้า
router.put('/edit/:item_id', isAdmin, upload.single('image'), (req, res) => {
  let { name, description, price, category_id, availability } = req.body;
  const { item_id } = req.params;
  const imagePath = req.file ? req.file.path : null;

  // แปลงประเภทข้อมูล
  price = parseFloat(price);
  category_id = parseInt(category_id, 10);
  availability = availability === 'true' || availability === true ? 1 : 0;

  const query = `
    UPDATE items 
    SET name = ?, description = ?, price = ?, category_id = ?, image_url = IFNULL(?, image_url), availability = ? 
    WHERE item_id = ?
  `;

  db.query(
    query,
    [name, description, price, category_id, imagePath, availability, item_id],
    (err, results) => {
      if (err) {
        console.error('Error editing item:', err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแก้ไขสินค้า' });
      }
      res.status(200).json({ message: 'แก้ไขสินค้าสำเร็จ' });
    }
  );
});

// **DELETE** route สำหรับลบสินค้า
router.delete('/delete/:item_id', isAdmin, (req, res) => {
  const { item_id } = req.params;

  const query = 'DELETE FROM items WHERE item_id = ?';

  db.query(query, [item_id], (err, results) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบสินค้า' });
    }
    res.status(200).json({ message: 'ลบสินค้าสำเร็จ' });
  });
});

module.exports = router;
