const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Login Endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('กรุณากรอกข้อมูลให้ครบถ้วน');
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('เกิดข้อผิดพลาดในการตรวจสอบข้อมูล');
    }

    if (results.length === 0) {
      return res.status(401).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Bcrypt compare error:', err);
        return res.status(500).send('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน');
      }

      if (!isMatch) {
        return res.status(401).send('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }

      // บันทึกข้อมูลผู้ใช้ใน session
      req.session.user = {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      };

      console.log('Login successful:', req.session.user);
      res.json({ user: req.session.user });
    });
  });
});

// Logout Endpoint
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('เกิดข้อผิดพลาดในการออกจากระบบ');
      } else {
        res.clearCookie('connect.sid');
        res.send('ออกจากระบบสำเร็จ');
      }
    });
  } else {
    res.send('ไม่มีการเข้าสู่ระบบ');
  }
});

module.exports = router;
