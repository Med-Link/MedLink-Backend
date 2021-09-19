/* eslint-disable consistent-return */

const jwt = require('jsonwebtoken');

const pool = require('../db/db');

exports.addOrder = async (req, res) => {
  const {
    description, pharmacyid,
  } = req.body;

  let orderPics = [];

  if (req.files.length > 0) {
    orderPics = req.files.map((file) => ({ img: file.location }));
  }
  let names = [];
  names = orderPics.map((item) => item.img);

  // const obj = JSON.parse(names);
  // console.log(req.files);

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;
  // var decoded = jwt_decode(token);
  // console.log(customerid);
  const status = 'undefined';
  const datetime = new Date();
  // console.log(datetime);

  try {
    const newOrder = await pool.query(
      'INSERT INTO public.order_req (description, prescription, customerid, pharmacyid, acceptstatus,date ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [description, names, customerid, pharmacyid, status, datetime],
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

exports.rejectedorders = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const customerid = decoded.payload.id;
  const status = 'rejected';
  try {
    const getallrejected = await pool.query(
      'SELECT * FROM order_req INNER JOIN pharmacy ON order_req.pharmacyid = pharmacy.pharmacyid WHERE customerid = $1 AND acceptstatus = $2 ORDER BY id DESC LIMIT 15', [
        customerid, status,
      ],
    );
    const { rows } = getallrejected;

    if (getallrejected) {
      return res.status(200).json({
        message: 'rejected order requests listed success',
        rows,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};