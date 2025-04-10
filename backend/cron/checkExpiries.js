const Driver = require('../models/Driver');

const checkDriverExpiries = async () => {
  try {
    const now = new Date();
    const drivers = await Driver.find();

    for (const driver of drivers) {
      if (driver.licenseExpiry && driver.licenseExpiry < now) {
        driver.status = 'Expired';
        await driver.save();
      }
    }

    console.log('Expired drivers updated');
  } catch (err) {
    console.error('Error checking expiries:', err.message);
  }
};

module.exports = checkDriverExpiries;
