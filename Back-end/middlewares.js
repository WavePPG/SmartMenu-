// middlewares.js

function isAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.status(403).send('คุณไม่มีสิทธิ์เข้าถึง');
    }
  }
  
  module.exports = { isAdmin };
  