const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const noAccessErr = { success: false, message: "אין גישה!" }

  const { token } = req.cookies;

  if (!token)
    return res ? res.status(401).json(noAccessErr) : next();

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.user);

    if (!user)
      return res ? res.json(noAccessErr) : next();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    //if we dont have a response its a "justCheck" call
    if (!res)
      return next();

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

module.exports.justCheck = (req) => {
  return new Promise((res, rej) => {
    module.exports(req, undefined, res)
  })
}