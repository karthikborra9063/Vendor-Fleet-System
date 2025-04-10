const Vendor = require('../models/Vendor');

const checkPermission = (permission) => {
  return (req, res, next) => {
    console.log(req.user.vendor.permissions);
    if (!req.user?.vendor?.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Access denied: Missing permission' });
    }
    next();
  };
};

module.exports = checkPermission;
