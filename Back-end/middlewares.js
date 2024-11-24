// middlewares.js
function isAdmin(req, res, next) {
  console.log('Session Data:', req.session);
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    console.log('User is admin:', req.session.user);
    return next();
  } else {
    console.log('Access denied. User is not admin or not logged in.');
    return res.status(403).send('คุณไม่มีสิทธิ์เข้าถึง');
  }
}

module.exports = { isAdmin };
