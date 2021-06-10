const express = require('express');
const env = require("dotenv");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const pharmacyRoutes = require('./routes/pharmacy/auth');
const orderRoutes = require('./routes/order')
const pharmacyorderRoutes = require('./routes/pharmacy/order')



env.config();
//already included in express package
//can use express.json instead of body parser
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

//mongodb+srv://root:<password>@cluster0.icjfy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.icjfy.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
      {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex:true
      }
).then(()=>{
      console.log('Database connected');
});

app.get('/',(req,res, next)=>{
      res.status(200).json({
            message: 'Hello from Server'
      });
});

app.post('/data',(req,res, next)=>{
      res.status(200).json({
            message: req.body
      });
});

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', pharmacyRoutes);
app.use('/api', orderRoutes);
app.use('/api', pharmacyorderRoutes);





app.listen(process.env.PORT, ()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
});