const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  model: String,
  seatingCapacity: Number,
  fuelType: String,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Car', carSchema);
