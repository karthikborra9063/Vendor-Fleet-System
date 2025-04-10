const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const Vendor = require('../models/Vendor');
const protect = require('../middleware/authMiddleware');
const checkPermission = require('../middleware/checkPermission');


router.post('/', protect, checkPermission('canAddCars'), async (req, res) => {
  const { registrationNumber, model, seatingCapacity, fuelType } = req.body;

  try {
    if (!req.user.vendor) {
      return res.status(403).json({ message: 'You are not associated with a vendor' });
    }

    const car = new Car({
      registrationNumber,
      model,
      seatingCapacity,
      fuelType,
      vendor: req.user.vendor._id,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error adding car', error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let vendorIds = [];

    if (req.user.role === 'Super') {
      const allVendors = await Vendor.find().select('_id');
      vendorIds = allVendors.map(v => v._id);
    } else {
      const currentVendorId = req.user.vendor._id;
      const subVendors = await Vendor.find({ parentVendor: currentVendorId }).select('_id');
      vendorIds = [currentVendorId, ...subVendors.map(v => v._id)];
    }
    const cars = await Car.find({ vendor: { $in: vendorIds } }).populate('vendor', 'name role');

    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
});


module.exports = router;
