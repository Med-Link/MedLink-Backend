// const Order = require('../models/order');

const jwt = require('jsonwebtoken');

const pool = require('../db/db');

// eslint-disable-next-line consistent-return
exports.addOrder = async (req, res) => {
  const {
    description, pharmacyid,
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
  const status = 'undefined';

  try {
    const newOrder = await pool.query(
      'INSERT INTO public.order_req (description, prescription, customerid, pharmacyid, acceptstatus ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [description, names, customerid, pharmacyid, status],
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

// eslint-disable-next-line consistent-return
exports.getOrder_reqs = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;
  // var decoded = jwt_decode(token);
  // console.log(customerid);

  try {
    const allOrders = await pool.query(
      'SELECT * FROM order_req WHERE customerid = $1', [
        customerid,
      ],
    );

    if (allOrders.rows.length === 0) {
      return res.status(401).json('No rows to show');
    }

    if (allOrders) {
      return res.status(201).json({
        message: 'orders listed success',
        allOrders,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// eslint-disable-next-line consistent-return
exports.getOrder_req = async (req, res) => {
  const {
    orderid,
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;
  // var decoded = jwt_decode(token);
  // console.log(customerid);

  try {
    const singleOrder = await pool.query(
      'SELECT * FROM order_req WHERE customerid = $1 AND id = $2', [
        customerid, orderid,
      ],
    );
    if (singleOrder.rows.length === 0) {
      return res.status(401).json('No rows to show');
    }

    if (singleOrder) {
      return res.status(201).json({
        message: 'orders listed success',
        singleOrder,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
