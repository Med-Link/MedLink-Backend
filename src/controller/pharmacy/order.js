/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

// eslint-disable-next-line consistent-return
exports.getPharmacyOrder_reqs = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;
  const status = 'rejected';
  const status2 = 'accepted';
  try {
    const allOrders = await pool.query(
      'SELECT * FROM order_req INNER JOIN customers ON order_req.customerid= customers.customerid WHERE pharmacyid = $1 AND acceptstatus != $2 AND acceptstatus !=$3', [
        pharmacyid, status, status2,
      ],
    );
      console.log(allOrders);
    if (allOrders.rows.length === 0) {
      return res.status(400).json('No rows to show');
    }

    if (allOrders) {
      return res.status(200).json({
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
    orderreqid,
  } = req.body;

  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const singleOrder = await pool.query(
      'SELECT * FROM order_req WHERE order_req.pharmacyid = $1 AND order_req.id = $2', [
        pharmacyid, orderreqid,
      ],
    );
    if (singleOrder.rows.length === 0) {
      return res.status(400).json('No rows to show');
    }

    if (singleOrder) {
      return res.status(200).json({
        message: 'orders listed success',
        singleOrder,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.rejectOrder_req = async (req, res) => {
  const {
    orderreqid,
    rejectmessage,
  } = req.body;

  const status = 'rejected';

  try {
    const rejectOrder = await pool.query(
      'UPDATE public.order_req SET acceptstatus = $1, rejectmessage = $2 WHERE id = $3', [
        status, rejectmessage, orderreqid,
      ],
    );
    // if (singleOrder.rows.length === 0) {
    //   return res.status(401).json('No rows to show');
    // }

    if (rejectOrder) {
      return res.status(200).json({
        message: 'orders rejected success',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.countAcceptedOrders = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const acceptcount = await pool.query(
      "SELECT COUNT(id) FROM order_req WHERE acceptstatus='accepted' AND pharmacyid = $1", [
        pharmacyid,
      ],
    );
      // console.log(acceptcount);
    if (acceptcount.rows.length === 0) {
      return res.status(400).json('No rows to show');
    }

    if (acceptcount) {
      return res.status(200).json({
        message: 'orders listed success',
        acceptcount,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
