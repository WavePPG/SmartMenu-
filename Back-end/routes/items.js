// routes/items.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middlewares');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// เพิ่มสินค้าใหม่ (สำหรับ Admin เท่านั้น)
router.post('/add', isAdmin, upload.single('image'), (req, res) => {
  let { name, description, price, category_id, availability } = req.body;
  const imagePath = req.file ? req.file.path : null;

  // แปลงประเภทข้อมูล
  price = parseFloat(price);
  category_id = parseInt(category_id, 10);
  availability = availability === 'true' || availability === true ? 1 : 0;

  if (!name || !price || !category_id) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  db.query(
    'INSERT INTO items (name, description, price, category_id, image_url, availability) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, price, category_id, imagePath, availability],
    (err) => {
      if (err) {
        return res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }
      res.status(201).send('เพิ่มสินค้าใหม่สำเร็จ');
    }
  );
});

// ดึงรายการสินค้าทั้งหมด
router.get('/', (req, res) => {
  const query = `
    SELECT items.*, categories.name AS category_name 
    FROM items 
    JOIN categories ON items.category_id = categories.category_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    }
    res.json(results);
  });
});

module.exports = router;
