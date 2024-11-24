// server/index.js

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = 5000;

// Import routes
const authRoute = require('./routes/auth');
const adminUsersRoute = require('./routes/admin_users');
const itemsRoute = require('./routes/items');
const categoriesRoute = require('./routes/categories');
const tablesRoute = require('./routes/tables');
// หากมี routes/orders.js ให้เพิ่มเข้ามาด้วย
// const ordersRoute = require('./routes/orders');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // URL ของ Front-end
  credentials: true
}));
app.use(express.json());

// Setup session
app.use(session({
  secret: 'your_secret_key', // เปลี่ยนเป็น secret key ของคุณ
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // ตั้งเป็น true หากใช้ HTTPS
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // อายุของคุกกี้ (1 ชั่วโมง)
    sameSite: 'lax' // ตั้งค่า sameSite ตามความต้องการ
  }
}));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/admin/users', adminUsersRoute);
app.use('/api/admin/items', itemsRoute); // แก้ไขเส้นทาง items ให้ตรงกับ frontend
app.use('/api/admin/categories', categoriesRoute);
app.use('/api/admin/tables', tablesRoute);
// หากมี orders.js ให้เพิ่มเส้นทางนี้
// app.use('/api/orders', ordersRoute);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
