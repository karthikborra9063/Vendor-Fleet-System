const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: String,
  licenseNumber: String,
  licenseExpiry: Date,
  assignedCar: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', default: null },
  documents: {
    licenseImage: String,
    rc: String,
    pollutionCertificate: String
  },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Expired'],
    default: 'Pending'
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Driver', driverSchema);
