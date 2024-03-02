const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const noAccessErr = { success: false, message: "אין גישה!" }

  const { token } = req.cookies;
  if (!token)
    return res.status(401).json(noAccessErr);

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.user);

    if (!user)
      return res.json(noAccessErr);

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError')
      return res.status(401).json(noAccessErr);

    if (error.name === 'TokenExpiredError')
      return res.status(401).json({
        success: false,
        message: 'משתמש נותק - יש להתחבר שנית!',
        timeout: true
      });

    res.status(500).json({ success: false, message: 'Internal server error!' });
  }
};
