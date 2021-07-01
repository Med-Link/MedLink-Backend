// const Order = require('../../models/order');
const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

// eslint-disable-next-line consistent-return
exports.getPharmacyOrder_reqs = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  // var decoded = jwt_decode(token);
  // console.log(pharmacyid);

  try {
    const allOrders = await pool.query(
      'SELECT * FROM order_req WHERE pharmacyid = $1', [
        pharmacyid,
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
exports.getPharmacyOrder_req = async (req, res) => {
  const {
    orderid,
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  // var decoded = jwt_decode(token);
  // console.log(customerid);

  try {
    const singleOrder = await pool.query(
      'SELECT * FROM order_req WHERE pharmacyid = $1 AND id = $2', [
        pharmacyid, orderid,
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
