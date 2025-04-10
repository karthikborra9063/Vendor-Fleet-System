const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  const { name, role, parentVendor, permissions } = req.body;

  try {
    const vendor = new Vendor({ name, role, parentVendor, permissions });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ message: 'Error creating vendor', error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('parentVendor', 'name role');
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching vendors', error: err.message });
  }
});

router.get('/filter/:role', protect, async (req, res) => {
  try {
    const { role } = req.params;
    const vendors = await Vendor.find({ role });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering vendors', error: err.message });
  }
});

router.get('/parent/:superId', protect, async (req, res) => {
  try {
    const subVendors = await Vendor.find({ parentVendor: req.params.superId });
    res.json(subVendors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sub-vendors', error: err.message });
  }
});

const buildVendorTree = async (parentId = null) => {
  const vendors = await Vendor.find({ parentVendor: parentId });
  const result = await Promise.all(
    vendors.map(async (vendor) => {
      const children = await buildVendorTree(vendor._id);
      return { ...vendor.toObject(), subVendors: children };
    })
  );
  return result;
};

router.get('/tree', protect, async (req, res) => {
  try {
    const tree = await buildVendorTree(null);
    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: 'Error building tree', error: err.message });
  }
});

router.put('/:id/permissions', protect, async (req, res) => {
  const { permissions } = req.body;

  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    vendor.permissions = permissions;
    await vendor.save();

    res.json({ message: 'Permissions updated', permissions: vendor.permissions });
  } catch (err) {
    res.status(500).json({ message: 'Error updating permissions', error: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const updated = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Vendor not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating vendor', error: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting vendor', error: err.message });
  }
});

module.exports = router;
