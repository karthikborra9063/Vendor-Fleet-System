const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const Vendor = require('../models/Vendor');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const checkPermission = require('../middleware/checkPermission');
const path = require('path');

router.post(
  '/',
  protect,
  checkPermission('canAddDrivers'),
  upload.fields([
    { name: 'licenseImage', maxCount: 1 },
    { name: 'rc', maxCount: 1 },
    { name: 'pollutionCertificate', maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, licenseNumber, licenseExpiry, assignedCar } = req.body;

    try {
      if (!req.user.vendor) {
        return res.status(403).json({ message: 'You are not associated with any vendor' });
      }

      const documents = {
        licenseImage: req.files['licenseImage']?.[0]?.path || '',
        rc: req.files['rc']?.[0]?.path || '',
        pollutionCertificate: req.files['pollutionCertificate']?.[0]?.path || '',
      };

      const driver = new Driver({
        name,
        licenseNumber,
        licenseExpiry,
        assignedCar: assignedCar || null,
        vendor: req.user.vendor._id,
        documents,
      });

      await driver.save();
      res.status(201).json(driver);
    } catch (error) {
      res.status(500).json({ message: 'Error adding driver', error: error.message });
    }
  }
);

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

    const drivers = await Driver.find({ vendor: { $in: vendorIds } })
      .populate('assignedCar', 'registrationNumber')
      .populate('vendor', 'name role');

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});


router.put('/:id/approve', protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.status = 'Approved';
    await driver.save();

    res.json({ message: 'Driver approved' });
  } catch (err) {
    res.status(500).json({ message: 'Error approving driver', error: err.message });
  }
});

router.put('/:id/reject', protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });

    driver.status = 'Rejected';
    await driver.save();

    res.json({ message: 'Driver rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting driver', error: err.message });
  }
});

router.get('/status/:status', protect, async (req, res) => {
  try {
    const drivers = await Driver.find({
      vendor: req.user.vendor._id,
      status: req.params.status,
    });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering drivers', error: err.message });
  }
});

module.exports = router;
