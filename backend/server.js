const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const vendorRoutes = require('./routes/vendorRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const carRoutes = require('./routes/carRoutes.js');
const driverRoutes = require('./routes/driverRoutes.js');
const cron = require('node-cron');
const checkDriverExpiries = require('./cron/checkExpiries');
const dashboardRoutes = require('./routes/dashboardRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/vendors', vendorRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/drivers', driverRoutes);
cron.schedule('0 0 * * *', () => {
    checkDriverExpiries();
  });
app.use('/api/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
