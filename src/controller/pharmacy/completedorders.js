/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

exports.countcloseddeals = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const alldeals = await pool.query('SELECT count(orderid) FROM public.completedorder WHERE pharmacyid = $1',
      [pharmacyid]);

    if (alldeals) {
      return res.status(200).json({
        message: 'all cloased deals listed success',
        alldeals,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.closeddeals = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const getorderhistory = await pool.query(
      'SELECT * FROM public.completedorder INNER JOIN public.customers ON completedorder.customerid = customers.customerid WHERE pharmacyid = $1 AND paymentstatus = $2 AND shipped =$3', [
        pharmacyid, true, false,
      ],
    );
    if (getorderhistory) {
      return res.status(200).json({
        message: 'order history listed',
        getorderhistory,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.markshipped = async (req, res) => {
  const {
    orderid,
  } = req.body;

  try {
    const marked = await pool.query(
      'UPDATE public.completed order SET shipped = $1 WHERE orderid = $2', [
        true, orderid,
      ],
    );
    if (marked) {
      return res.status(200).json({
        message: 'orders marked as shipped rejected ',
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.shippeddeals = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const getshippedorders = await pool.query(
      'SELECT * FROM public.completedorder INNER JOIN public.customers ON completedorder.customerid = customers.customerid WHERE pharmacyid = $1 AND paymentstatus = $2 AND shipped = $3', [
        pharmacyid, true, true,
      ],
    );
    if (getshippedorders) {
      return res.status(200).json({
        message: 'order history listed',
        getshippedorders,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
