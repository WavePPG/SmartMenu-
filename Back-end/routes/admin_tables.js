// routes/admin_tables.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAdmin } = require('../middlewares');
const QRCode = require('qrcode');

// เพิ่มโต๊ะ
router.post('/add', isAdmin, (req, res) => {
  const { table_number } = req.body;

  db.query('INSERT INTO tables (table_number) VALUES (?)', [table_number], (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการเพิ่มโต๊ะ');
    }

    const tableId = results.insertId;
    const qrData = `http://localhost:3000/table/${tableId}`; // URL สำหรับโต๊ะนั้น ๆ

    QRCode.toDataURL(qrData, (err, url) => {
      if (err) {
        return res.status(500).send('เกิดข้อผิดพลาดในการสร้าง QR Code');
      }

      db.query('UPDATE tables SET qr_code_url = ? WHERE table_id = ?', [url, tableId], (err) => {
        if (err) {
          return res.status(500).send('เกิดข้อผิดพลาดในการอัปเดตข้อมูลโต๊ะ');
        }
        res.status(201).send('เพิ่มโต๊ะพร้อม QR Code สำเร็จ');
      });
    });
  });
});

// ลบโต๊ะ
router.delete('/delete/:table_id', isAdmin, (req, res) => {
  const { table_id } = req.params;

  db.query('DELETE FROM tables WHERE table_id = ?', [table_id], (err, results) => {
    if (err) {
      return res.status(500).send('เกิดข้อผิดพลาดในการลบโต๊ะ');
    }
    res.status(200).send('ลบโต๊ะสำเร็จ');
  });
});

module.exports = router;
