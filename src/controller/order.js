// const Order = require('../models/order');

const jwt = require('jsonwebtoken');

const pool = require('../db/db');

exports.addOrder = async (req, res) => {
  const {
    description, prescription, pharmacyid,
  } = req.body;

  //   const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
  // var userId = decoded.id
  let orderPics = [];

  if (req.files.length > 0) {
    orderPics = req.files.map((file) => ({ img: file.location }));
  }
  let names = [];
  names = orderPics.map((item) => item.img);

  // const obj = JSON.parse(names);
  // console.log(obj);

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;
  // var decoded = jwt_decode(token);
  // console.log(customerid);

  try {
    const newOrder = await pool.query(
      'INSERT INTO public.order_req (description, prescription, customerid, pharmacyid ) VALUES ($1, $2, $3, $4) RETURNING *',
      [description, names, customerid, pharmacyid],
    );

    if (newOrder) {
      return res.status(201).json({
        message: 'order created success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//   var prescriptionPics = [];

//   if (req.files.length > 0) {
//     prescriptionPics = req.files.map((file) => {
//       return { img: file.location };
//     });
//   }
// console.log(prescriptionPics);

//   const order = new Order({
//     description,
//     prescriptionPics,
//     amount,
//     address,
//     contactNumber,
//     addedBy: req.user._id,
//   });

// const orderobj= {
//       description:req.body.description,
//       prescription:req.body.prescription,
//       amount:req.body.amount,
//       address:req.body.address,
//       contactNumber:req.body.contactNumber,
//       addedBy:req.user._id
// }

// const ord = new Order(orderobj);

//   order.save((error, order) => {
//     if (error) return res.status(400).json({ error });
//     if (order) {
//       return res.status(201).json({ order, files: req.files });
//     }
//     console.log(order);
//   });
// };

exports.getOrders = (req, res) => {
  Order.find({}).exec((error, orders) => {
    if (error) return res.status(400).json({ error });
    if (orders) {
      return res.status(201).json({ orders });
    }
  });
};
