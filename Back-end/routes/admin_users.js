// server/routes/admin_users.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const { isAdmin } = require('../middlewares');

// เพิ่มผู้ใช้ Admin คนแรก (ไม่ต้องตรวจสอบสิทธิ์)
router.post('/register-first-admin', (req, res) => {
  const { username, password, name, contact_info } = req.body;

  // ตรวจสอบว่ามีผู้ใช้ Admin อยู่แล้วหรือไม่
  db.query('SELECT * FROM users WHERE role = "admin"', (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล');
    }
    if (results.length > 0) {
      return res.status(403).send('มีผู้ใช้ Admin อยู่ในระบบแล้ว');
    }

    // เข้ารหัสรหัสผ่านด้วย bcrypt
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).send('เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน');
      }

      // บันทึกผู้ใช้ Admin ใหม่ลงในฐานข้อมูล
      db.query(
        'INSERT INTO users (username, password, role, name, contact_info) VALUES (?, ?, "admin", ?, ?)',
        [username, hash, name, contact_info],
        (err, results) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).send('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
            }
            return res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
          }
          res.status(201).send('เพิ่มผู้ใช้ Admin คนแรกสำเร็จ');
        }
      );
    });
  });
});

// เพิ่มผู้ใช้ใหม่ (เฉพาะ Admin เท่านั้น)
router.post('/register', isAdmin, (req, res) => {
  const { username, password, role, name, contact_info } = req.body;

  // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
  if (!username || !password || !role) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  // เข้ารหัสรหัสผ่านด้วย bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน');
    }

    // บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
    db.query(
      'INSERT INTO users (username, password, role, name, contact_info) VALUES (?, ?, ?, ?, ?)',
      [username, hash, role, name, contact_info],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
          }
          return res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
        res.status(201).send('เพิ่มผู้ใช้ใหม่สำเร็จ');
      }
    );
  });
});

module.exports = router;
