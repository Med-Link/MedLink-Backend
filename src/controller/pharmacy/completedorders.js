/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const pool = require('../../db/db');

exports.countcloseddeals = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const pharmacyid = decoded.payload.id;

  try {
    const alldeals = await pool.query('SELECT count(orderid) FROM public.completedorder, public.order_medlist, public.customers WHERE completedorder.orderid=order_medlist.order_reqid AND order_medlist.customerid=customers.customerid AND pharmacyid = $1',
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
      'SELECT * FROM public.completedorder INNER JOIN public.customers ON completedorder.customerid = customers.customerid WHERE pharmacyid = $1 AND paymentstatus = $2', [
        pharmacyid, true,
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
