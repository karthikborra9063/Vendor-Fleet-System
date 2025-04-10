const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Super', 'Regional', 'City', 'Local'],
    required: true,
  },
  parentVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    default: null,
  },
  permissions: {
    type: [String],
    default: ['canAddDrivers', 'canAddCars', 'canViewStats'],
  },  
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vendor', vendorSchema);
