const express = require('express');
const env = require('dotenv');
const cors = require('cors');

const app = express();
const bodyParser = require('body-parser');
// const pool= require('./db/db');
// const mongoose = require('mongoose');

// routes
const authRoutes = require('./routes/auth');
const ordercompleteRoutes = require('./routes/completedorders');
const customerorderbillRoutes = require('./routes/orderbill');
const orderRoutes = require('./routes/order');
const findpharmacyRoutes = require('./routes/findpharmacy');
const buyinghistoryRoutes = require('./routes/buyinghistory');


const pharmacyRoutes = require('./routes/pharmacy/auth');
const pharmacyorderRoutes = require('./routes/pharmacy/order');
const pharmacystockRoutes = require('./routes/pharmacy/stock');
const pharmacyorderbillRoutes = require('./routes/pharmacy/orderbill');
const pharmacyuserprofileRoutes = require('./routes/pharmacy/userprofile');
const pharmacycompletedorderRoutes = require('./routes/pharmacy/completedorders');
const pharmacydashboardRoutes = require('./routes/pharmacy/dashboard');


const adminRoutes = require('./routes/admin/auth');
const adminpharmacyhandlingRoutes = require('./routes/admin/handlingpharmacy');
const addnewadminRoutes = require('./routes/admin/addAdmin');
const handlemedicineRoutes = require('./routes/admin/handlemedicine');
const adminuserprofileRoutes = require('./routes/admin/userprofile');
const admindashboardRoutes = require('./routes/admin/dashboard');
const adminpharmacypayableRoutes = require('./routes/admin/pharmacypayable');
const adminincomeRoutes = require('./routes/admin/income');


env.config();
app.use(cors());
// already included in express package
// can use express.json instead of body parser
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

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
app.use('/api', findpharmacyRoutes);
app.use('/api', adminuserprofileRoutes);
app.use('/api', pharmacyuserprofileRoutes);
app.use('/api', admindashboardRoutes);
app.use('/api', pharmacycompletedorderRoutes);
app.use('/api', buyinghistoryRoutes);
app.use('/api', adminpharmacypayableRoutes);
app.use('/api', adminincomeRoutes);
app.use('/api', pharmacydashboardRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
