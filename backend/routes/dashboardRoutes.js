const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Driver = require('../models/Driver');
const Vendor = require('../models/Vendor');
const protect = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalDrivers = await Driver.countDocuments();
    const expiredDrivers = await Driver.countDocuments({ status: 'Expired' });
    const totalVendors = await Vendor.countDocuments();

    res.json({
      totalCars,
      totalDrivers,
      expiredDrivers,
      totalVendors
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard error', error: error.message });
  }
});

module.exports = router;
