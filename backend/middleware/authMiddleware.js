const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const protectRoute = async (req, res, next) => {
  console.log("Hii karthik");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token, authorization denied'});
  console.log("Hii karthik2");
  const token = authHeader.split(' ')[1];

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('vendor');
    console.log(req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protectRoute;
