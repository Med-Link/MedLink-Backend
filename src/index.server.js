const express = require('express');
const env = require('dotenv');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
// const pool= require('./db/db');
// const mongoose = require('mongoose');

// routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const adminpharmacyhandlingRoutes = require('./routes/admin/handlingpharmacy');
const pharmacyRoutes = require('./routes/pharmacy/auth');
const orderRoutes = require('./routes/order');
const pharmacyorderRoutes = require('./routes/pharmacy/order');
const pharmacyorderbillRoutes = require('./routes/pharmacy/orderbill');
const pharmacystockRoutes = require('./routes/pharmacy/stock');
const customerorderbillRoutes = require('./routes/orderbill');
const ordercompleteRoutes = require('./routes/completedorders');
const addnewadminRoutes = require('./routes/admin/addAdmin');
const handlemedicineRoutes = require('./routes/admin/handlemedicine');



env.config();
app.use(cors());
// already included in express package
// can use express.json instead of body parser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from Server',
  });
});

app.post('/data', (req, res) => {
  res.status(200).json({
    message: req.body,
  });
});

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', addnewadminRoutes);
app.use('/api', pharmacyRoutes);
app.use('/api', orderRoutes);
app.use('/api', pharmacyorderRoutes);
app.use('/api', adminpharmacyhandlingRoutes);
app.use('/api', pharmacyorderbillRoutes);
app.use('/api', pharmacystockRoutes);
app.use('/api', customerorderbillRoutes);
app.use('/api', ordercompleteRoutes);
app.use('/api', handlemedicineRoutes);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
