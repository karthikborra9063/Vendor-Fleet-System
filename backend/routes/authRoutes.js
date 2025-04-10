const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor')
router.post('/register', async (req, res) => {
  let { name, email, password, role, vendor } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    if (role === 'Super' && !vendor) {
      console.log("vendor");
      const newVendor = new Vendor({
        name: `${name}'s SuperVendor`,
        role: 'Super',
        parentVendor: null,
        permissions: ['canAddDrivers', 'canAddCabs', 'canViewStats'],
      });
      await newVendor.save();
      vendor = newVendor._id;
    }
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      vendor,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    console.log(token);

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
