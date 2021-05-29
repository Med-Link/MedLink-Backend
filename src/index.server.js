const express = require('express');
const env = require("dotenv");
const app = express();
const mongoose = require('mongoose');


//routes
const userRoutes = require('./routes/user');

env.config();

//mongodb+srv://root:<password>@cluster0.icjfy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect(
      `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.icjfy.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
      {
            useNewUrlParser: true, 
            useUnifiedTopology: true
      }
).then(()=>{
      console.log('Database connected');
});


app.use('./api',userRoutes);

app.listen(process.env.PORT, ()=>{
      console.log(`Server is running on port ${process.env.PORT}`);
});